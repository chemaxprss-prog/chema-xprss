"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";


export default function CartButton(){

  const {items,total}=useCart();
  const router = useRouter();


  return (

    <div
      className="
      fixed
      bottom-5
      left-4
      right-4
      z-50
      "
    >

      <div
        className="
        bg-white
        border
        border-gray-200
        rounded-3xl
        shadow-2xl
        p-4
        flex
        justify-between
        items-center
        "
      >


        <div>

          <h3
            className="
            font-extrabold
            text-lg
            text-blue-600
            "
          >
            🛒 Mi pedido
          </h3>


          <p
            className="
            text-sm
            text-gray-600
            "
          >
            {items.length === 0
              ? "Tu pedido está vacío"
              : `${items.length} productos`
            }
          </p>


        </div>




        <div
          className="
          text-right
          "
        >

          <p
            className="
            font-extrabold
            text-xl
            text-orange-600
            "
          >
            ${total}
          </p>




          <button

            onClick={()=>router.push("/cart")}

            className="
            bg-orange-500
            hover:bg-orange-600
            active:scale-95
            text-white
            px-5
            py-2
            rounded-full
            font-bold
            mt-2
            shadow-md
            transition
            "

          >
            Ver mi pedido
          </button>


        </div>



      </div>


    </div>

  );

}
