import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function MesCommandes() {
  const token = useAuthStore((s) => s.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <Navigate to="/connexion" replace />;
  if (loading) return <p className="text-slate-400">Chargement...</p>;

  const statusLabels = {
    PENDING: { label: "En attente", color: "text-yellow-400" },
    PAID: { label: "Payée", color: "text-green-400" },
    SHIPPED: { label: "Expédiée", color: "text-blue-400" },
    CANCELLED: { label: "Annulée", color: "text-red-400" },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="mb-4">Aucune commande pour le moment.</p>
          <Link
            to="/catalogue"
            className="inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition text-white"
          >
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusLabels[order.status] || {
              label: order.status,
              color: "text-slate-400",
            };
            return (
              <div
                key={order.id}
                className="bg-slate-900 rounded-xl border border-slate-800 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-slate-400">
                      Commande #{order.id}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-slate-300"
                    >
                      <span>
                        {item.quantity} × {item.product.name}
                      </span>
                      <span>
                        {((item.unitPriceCents * item.quantity) / 100).toFixed(
                          2
                        )}{" "}
                        €
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{(order.totalCents / 100).toFixed(2)} €</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}