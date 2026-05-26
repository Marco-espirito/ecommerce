import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-4">
        Bienvenue sur <span className="text-blue-400">MiniShop</span>
      </h1>
      <p className="text-slate-400 mb-8 text-lg">
        Du matos tech sélectionné, livré rapidement.
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