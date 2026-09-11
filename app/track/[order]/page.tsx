"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type TrackingOrder = {
  order_number: string;
  status: string;
  delivery_type: string;
  created_at: string;
};

const STATUS_STEPS = [
  {
    status: "PENDIENTE",
    title: "Pedido recibido",
    icon: "🧾",
    description: "Recibimos correctamente tu pedido.",
  },
  {
    status: "CONFIRMADO",
    title: "Pedido confirmado",
    icon: "✅",
    description: "El negocio confirmó tu pedido.",
  },
  {
    status: "PREPARANDO",
    title: "Preparando",
    icon: "👨‍🍳",
    description: "Estamos preparando tus alimentos.",
  },
  {
    status: "LISTO",
    title: "Pedido listo",
    icon: "🥡",
    description: "Tu pedido está listo para entregar.",
  },
  {
    status: "EN_CAMINO",
    title: "En camino",
    icon: "🛵",
    description: "Tu pedido va en camino.",
  },
  {
    status: "ENTREGADO",
    title: "Entregado",
    icon: "🎉",
    description: "Tu pedido fue entregado.",
  },
];

export default function TrackOrderPage() {
  const params = useParams();

  const rawOrder = params?.order;

  const orderNumber = Array.isArray(rawOrder)
    ? rawOrder[0]
    : rawOrder;

  const [order, setOrder] =
    useState<TrackingOrder | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadOrder = useCallback(async () => {
    if (!orderNumber) {
      return;
    }

    try {
      const { data, error } =
        await supabase.rpc(
          "get_order_tracking",
          {
            p_order_number:
              decodeURIComponent(orderNumber),
          }
        );

      if (error) {
        console.log(
          "ERROR CARGANDO TRACKING:",
          error
        );

        setError(
          "No pudimos consultar el pedido."
        );

        setLoading(false);

        return;
      }

      if (!data || data.length === 0) {
        setError(
          "No encontramos este pedido."
        );

        setOrder(null);

        setLoading(false);

        return;
      }

      setOrder(data[0]);

      setError("");

      setLoading(false);
    } catch (err) {
      console.log(
        "ERROR GENERAL TRACKING:",
        err
      );

      setError(
        "No pudimos consultar el pedido."
      );

      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    loadOrder();

    /*
     * Actualizamos cada 10 segundos.
     *
     * Así el cliente puede dejar esta pantalla
     * abierta y verá los cambios sin tener
     * que recargar manualmente.
     */
    const interval =
      window.setInterval(() => {
        loadOrder();
      }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadOrder]);

  function getCurrentStep() {
    if (!order) {
      return 0;
    }

    const index =
      STATUS_STEPS.findIndex(
        (step) =>
          step.status === order.status
      );

    return index >= 0
      ? index
      : 0;
  }

  const currentStep =
    getCurrentStep();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl shadow-md p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">
            🦐
          </div>

          <h1 className="text-2xl font-black text-gray-900">
            Consultando pedido...
          </h1>

          <p className="text-gray-500 mt-2">
            Un momento por favor.
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl shadow-md p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">
            😕
          </div>

          <h1 className="text-2xl font-black text-gray-900">
            Pedido no encontrado
          </h1>

          <p className="text-gray-500 mt-3">
            {error ||
              "No encontramos información para este pedido."}
          </p>
        </div>
      </main>
    );
  }

  const isCancelled =
    order.status === "CANCELADO";

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 pb-10">
      <div className="max-w-xl mx-auto">

        {/* ENCABEZADO */}

        <div className="text-center py-6">
          <div className="text-5xl mb-3">
            🦐
          </div>

          <h1 className="text-3xl font-black text-gray-900">
            Seguimiento de pedido
          </h1>

          <p className="text-gray-500 mt-2">
            Consulta aquí el estado de tu pedido.
          </p>
        </div>

        {/* PEDIDO */}

        <div className="bg-white rounded-3xl shadow-md p-6 mb-5">

          <p className="text-sm text-gray-500 font-bold">
            TU PEDIDO
          </p>

          <h2 className="text-3xl font-black text-orange-600 mt-1">
            {order.order_number}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">

            <span className="bg-gray-100 rounded-full px-4 py-2 text-sm font-bold text-gray-700">
              {order.delivery_type ===
              "Domicilio"
                ? "🛵 Envío a domicilio"
                : "🚶 Recoger en negocio"}
            </span>

            <span className="bg-orange-50 rounded-full px-4 py-2 text-sm font-bold text-orange-700">
              Estado: {order.status}
            </span>

          </div>
        </div>

        {/* CANCELADO */}

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-5">

            <div className="text-4xl mb-3">
              ❌
            </div>

            <h2 className="text-xl font-black text-red-700">
              Pedido cancelado
            </h2>

            <p className="text-red-600 mt-2">
              Este pedido fue cancelado.
              Comunícate con el negocio si
              necesitas más información.
            </p>

          </div>
        )}

        {/* TRACKING */}

        {!isCancelled && (
          <div className="bg-white rounded-3xl shadow-md p-6">

            <h2 className="text-xl font-black text-gray-900 mb-6">
              Estado de tu pedido
            </h2>

            <div className="space-y-0">

              {STATUS_STEPS.map(
                (step, index) => {

                  const completed =
                    index <= currentStep;

                  const current =
                    index === currentStep;

                  const last =
                    index ===
                    STATUS_STEPS.length - 1;

                  return (
                    <div
                      key={step.status}
                      className="flex"
                    >

                      {/* INDICADOR */}

                      <div className="flex flex-col items-center mr-4">

                        <div
                          className={`
                            w-12
                            h-12
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-xl
                            font-black
                            border-4
                            ${
                              completed
                                ? "bg-orange-500 border-orange-500 text-white"
                                : "bg-white border-gray-200 text-gray-400"
                            }
                          `}
                        >
                          {step.icon}
                        </div>

                        {!last && (
                          <div
                            className={`
                              w-1
                              min-h-16
                              flex-1
                              ${
                                index <
                                currentStep
                                  ? "bg-orange-500"
                                  : "bg-gray-200"
                              }
                            `}
                          />
                        )}

                      </div>

                      {/* INFORMACIÓN */}

                      <div className="pb-8 flex-1">

                        <div className="flex items-center gap-2">

                          <h3
                            className={`
                              font-black
                              text-lg
                              ${
                                completed
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }
                            `}
                          >
                            {step.title}
                          </h3>

                          {current && (
                            <span className="bg-orange-100 text-orange-700 text-xs font-black px-3 py-1 rounded-full">
                              AHORA
                            </span>
                          )}

                        </div>

                        <p
                          className={`
                            mt-1
                            text-sm
                            ${
                              completed
                                ? "text-gray-500"
                                : "text-gray-300"
                            }
                          `}
                        >
                          {step.description}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>
        )}

        {/* ACTUALIZACIÓN */}

        <p className="text-center text-xs text-gray-400 mt-5">
          Esta pantalla se actualiza automáticamente.
        </p>

      </div>
    </main>
  );
}