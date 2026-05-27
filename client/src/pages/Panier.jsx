import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import api from "../api/client";
import { useState } from "react";

export default function Panier() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const totalCents = items.reduce(
    (sum, i) => sum + i.priceCents * i.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!token) {
      navigate("/connexion");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const res = await api.post("/checkout", {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });
      // Redirection vers la page Stripe
      window.location.href = res.data.url;
    } catch (err) {
      setCheckoutError(err.response?.data?.error || "Erreur de paiement");
      setCheckoutLoading(false);
    }
  };


  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-slate-400 mb-8">
          Découvrez nos produits et trouvez votre bonheur.
        </p>
        <Link
          to="/catalogue"
          className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex gap-4 items-center"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-slate-400 text-sm">
                  {(item.priceCents / 100).toFixed(2)} € l'unité
                </p>
              </div>

              {/* Quantité */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  −
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  +
                </button>
              </div>

              {/* Sous-total */}
              <div className="text-right min-w-[80px]">
                <p className="font-bold">
                  {((item.priceCents * item.quantity) / 100).toFixed(2)} €
                </p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-xs text-red-400 hover:text-red-300 transition mt-1"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clear}
            className="text-sm text-slate-400 hover:text-red-400 transition"
          >
            Vider le panier
          </button>
        </div>

        {/* Récapitulatif */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>

          <div className="space-y-2 mb-4 text-slate-300">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{(totalCents / 100).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span className="text-green-400">Gratuite</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{(totalCents / 100).toFixed(2)} €</span>
            </div>
          </div>

          {checkoutError && (
  <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg p-3 text-sm mb-4">
    {checkoutError}
  </div>
)}

<button
  onClick={handleCheckout}
  disabled={checkoutLoading}
  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
>
  {checkoutLoading
    ? "Redirection..."
    : token
    ? "Passer commande"
    : "Se connecter pour commander"}
</button>

          <Link
            to="/catalogue"
            className="block text-center text-sm text-slate-400 hover:text-white mt-4 transition"
          >
            ← Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}