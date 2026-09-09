"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type OrderItem = {
  id: number;
  product_name: string;
  size: string | null;
  quantity: number;
  subtotal: number;
  notes?: string | null;
};

type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_type: string;
  address: string | null;
  notes: string | null;
  payment_method: string;
  payment_status: string | null;
  status: string;
  total: number;
  created_at: string;
  order_items: OrderItem[];
};

export default function ConfirmationClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderNumber) {
      setError("No se encontró el número de pedido.");
      setLoading(false);
      return;
    }

    loadOrder(orderNumber);
  }, [orderNumber]);

  async function loadOrder(number: string) {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*)
        `)
        .eq("order_number", number)
        .single();

      if (error) {
        console.error("ERROR CARGANDO PEDIDO:", error);
        setError("No pudimos encontrar tu pedido.");
        setLoading(false);
        return;
      }

      setOrder(data as Order);
      setLoading(false);
    } catch (err) {
      console.error("ERROR GENERAL CONFIRMACION:", err);
      setError("Ocurrió un error al cargar el pedido.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-4">🍤</div>
          <p className="text-xl font-black text-gray-900">
            Cargando pedido...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-5">⚠️</div>

          <h1 className="text-2xl font-black text-gray-900 mb-3">
            No pudimos cargar tu pedido
          </h1>

          <p className="text-gray-500 mb-6">
            {error || "El pedido no existe."}
          </p>

          <button
            type="button"
            onClick={() => window.location.href = "/"}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-full font-black"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5 pb-10">
      <div className="max-w-2xl mx-auto">

        {/* ENCABEZADO */}
        <div className="bg-white rounded-3xl shadow-xl p-7 text-center mb-5">
          <div className="text-6xl mb-4">
            ✅
          </div>

          <h1 className="text-3xl font-black text-gray-900">
            ¡Pedido recibido!
          </h1>

          <p className="text-gray-500 mt-2">
            Gracias por tu pedido.
          </p>

          <div className="mt-6 bg-orange-50 rounded-2xl p-5">
            <p className="text-sm font-bold text-gray-500">
              NÚMERO DE PEDIDO
            </p>

            <p className="text-3xl font-black text-orange-600 mt-1">
              {order.order_number}
            </p>
          </div>
        </div>

        {/* ESTADO */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-5">
          <h2 className="text-xl font-black mb-4">
            Estado del pedido
          </h2>

          <div className="bg-blue-50 rounded-2xl p-5">
            <p className="text-2xl font-black text-blue-700">
              {order.status}
            </p>

            <p className="text-gray-500 mt-1">
              Te avisaremos cuando tu pedido avance.
            </p>
          </div>
        </div>

        {/* DATOS DEL CLIENTE */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-5">
          <h2 className="text-xl font-black mb-4">
            Datos del pedido
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Cliente:</strong>{" "}
              {order.customer_name}
            </p>

            <p>
              <strong>WhatsApp:</strong>{" "}
              {order.customer_phone}
            </p>

            <p>
              <strong>Entrega:</strong>{" "}
              {order.delivery_type}
            </p>

            {order.address && (
              <p>
                <strong>Dirección:</strong>{" "}
                {order.address}
              </p>
            )}

            <p>
              <strong>Pago:</strong>{" "}
              {order.payment_method}
            </p>

            {order.notes && (
              <p>
                <strong>Notas:</strong>{" "}
                {order.notes}
              </p>
            )}
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-5">
          <h2 className="text-xl font-black mb-5">
            Tu pedido
          </h2>

          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-2xl p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-black text-gray-900">
                      {item.product_name}
                    </p>

                    {item.size && (
                      <p className="text-sm text-gray-500">
                        {item.size}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      Cantidad: {item.quantity}
                    </p>

                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        Nota: {item.notes}
                      </p>
                    )}
                  </div>

                  <p className="font-black text-gray-900 whitespace-nowrap">
                    ${Number(item.subtotal).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-5 pt-5 flex justify-between">
            <span className="text-xl font-black">
              TOTAL
            </span>

            <span className="text-2xl font-black text-orange-600">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* WHATSAPP */}
        {order.customer_phone && (
          <a
            href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-full font-black mb-4"
          >
            💬 Contactar por WhatsApp
          </a>
        )}

        {/* VOLVER */}
        <button
          type="button"
          onClick={() => window.location.href = "/"}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-full font-black"
        >
          Volver al inicio
        </button>

      </div>
    </main>
  );
}