import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export default function CommandeConfirmee() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    // Vide le panier après paiement réussi
    clear();
  }, [clear]);

  return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
      <p className="text-slate-400 mb-8">
        Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
      </p>

      {sessionId && (
        <p className="text-xs text-slate-500 mb-8">
          Référence : {sessionId.slice(0, 20)}...
        </p>
      )}

      <div className="flex gap-4 justify-center">
        <Link
          to="/mes-commandes"
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition"
        >
          Voir mes commandes
        </Link>
        <Link
          to="/catalogue"
          className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}