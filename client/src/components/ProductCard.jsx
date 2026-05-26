import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500 transition flex flex-col">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs uppercase text-blue-400 mb-1">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold mb-2 hover:text-blue-400 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            {(product.priceCents / 100).toFixed(2)} €
          </span>
          <button
            onClick={() => addItem(product)}
            className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-sm transition"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}