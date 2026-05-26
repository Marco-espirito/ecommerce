import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function MonCompte() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .get("/me")
      .then((res) => setProfile(res.data))
      .catch(() => logout()) // token expiré → déconnexion
      .finally(() => setLoading(false));
  }, [token, logout]);

  // Si pas connecté → redirige vers /connexion
  if (!token) return <Navigate to="/connexion" replace />;

  if (loading) return <p className="text-slate-400">Chargement...</p>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Mon compte</h1>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
        <div>
          <p className="text-sm text-slate-400">Email</p>
          <p className="font-semibold">{profile.email}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Rôle</p>
          <p className="font-semibold">{profile.role}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Membre depuis</p>
          <p className="font-semibold">
            {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition text-sm"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}