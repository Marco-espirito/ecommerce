import { useEffect, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: category ? { category } : {} })
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  const categories = ["audio", "peripherique", "video", "ecran", "stockage", "accessoire"];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Catalogue</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-2 rounded-lg text-sm transition ${
            category === ""
              ? "bg-blue-600"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          Tous
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-lg text-sm transition capitalize ${
              category === c
                ? "bg-blue-600"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="text-slate-400">Chargement...</p>}
      {error && <p className="text-red-400">Erreur : {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}