import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const user = useAuthStore((s) => s.user);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Mini-<span className="text-blue-400">boutique</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-400 transition">
            Accueil
          </Link>
          <Link to="/catalogue" className="hover:text-blue-400 transition">
            Catalogue
          </Link>

          {user ? (
            <Link
              to="/mon-compte"
              className="hover:text-blue-400 transition text-sm"
            >
              {user.email}
            </Link>
          ) : (
            <Link
              to="/connexion"
              className="hover:text-blue-400 transition"
            >
              Connexion
            </Link>
          )}

          <Link
            to="/panier"
            className="relative bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
          >
            Panier
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}