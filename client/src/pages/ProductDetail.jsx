import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useCartStore } from "../store/cartStore";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-slate-400">Chargement...</p>;
  if (error) return <p className="text-red-400">Erreur : {error}</p>;
  if (!product) return null;

  return (
    <div>
      <Link to="/catalogue" className="text-blue-400 hover:underline mb-6 inline-block">
        ← Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full rounded-xl"
        />
        <div>
          <span className="text-xs uppercase text-blue-400">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold mb-4 mt-1">{product.name}</h1>
          <p className="text-slate-400 mb-6">{product.description}</p>
          <p className="text-4xl font-bold mb-2">
            {(product.priceCents / 100).toFixed(2)} €
          </p>
          <p className="text-sm text-slate-500 mb-6">
            {product.stock > 0
              ? `${product.stock} en stock`
              : "Rupture de stock"}
          </p>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}