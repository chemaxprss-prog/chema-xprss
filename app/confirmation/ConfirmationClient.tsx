"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { getBusiness } from "@/lib/business";



type OrderItem = {

  id:number;

  product_name:string;

  size:string | null;

  quantity:number;

  subtotal:number;

  notes?:string | null;

};




type Order = {

  id:number;

  order_number:string;

  customer_name:string;

  customer_phone:string;

  delivery_type:string;

  address:string | null;

  notes:string | null;

  payment_method:string;

  status:string;

  total:number;

  created_at:string;

  order_items:OrderItem[];

};





export default function ConfirmationClient(){


const searchParams = useSearchParams();


const orderNumber =
searchParams.get("order");



const [order,setOrder] =
useState<Order | null>(null);



const [business,setBusiness] =
useState<any>(null);



const [loading,setLoading] =
useState(true);



const [error,setError] =
useState("");







useEffect(()=>{


if(!orderNumber){


setError(
"No se encontró el número de pedido."
);


setLoading(false);


return;


}



loadOrder(orderNumber);

loadBusiness();



},[orderNumber]);







async function loadBusiness(){


const data =
await getBusiness();


setBusiness(data);


}









async function loadOrder(number:string){


try{


setLoading(true);



const {data,error}=await supabase.rpc(

"get_order_confirmation",

{

p_order_number:number

}

);





if(error){


console.log(
"ERROR PEDIDO:",
error
);


setError(
"No pudimos cargar tu pedido."
);


setLoading(false);


return;


}





if(!data){


setError(
"Pedido no encontrado."
);


setLoading(false);


return;


}




setOrder(
data as Order
);



setLoading(false);



}catch(error){



console.log(error);



setError(
"Error cargando pedido."
);



setLoading(false);



}



}








const trackingUrl =

order

?

`${typeof window !== "undefined" ? window.location.origin : ""}/track/${order.order_number}`

:

"";








if(loading){


return (

<main className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
p-5
">


<div className="
bg-white
rounded-3xl
p-8
shadow-xl
text-center
">


<div className="
text-5xl
mb-4
">

🍤

</div>



<p className="
font-black
text-xl
">

Cargando pedido...

</p>


</div>


</main>

);


}



if(error || !order){

return (

<main className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
p-5
">

<div className="
bg-white
rounded-3xl
shadow-xl
p-8
text-center
max-w-md
w-full
">

<div className="text-6xl mb-5">
⚠️
</div>


<h1 className="
text-2xl
font-black
mb-3
">
Pedido no encontrado
</h1>


<p className="
text-gray-500
mb-6
">
{error}
</p>


<button

onClick={()=>{

window.location.href="/";

}}

className="
w-full
bg-orange-500
text-white
py-4
rounded-full
font-black
"

>

Volver al inicio

</button>


</div>


</main>

);

}



return (

<main className="
min-h-screen
bg-gray-100
p-5
pb-10
">


<div className="
max-w-2xl
mx-auto
">



{/* CONFIRMACION */}



<div className="
bg-white
rounded-3xl
shadow-xl
p-7
text-center
mb-5
">


<div className="
text-6xl
mb-4
">

✅

</div>



<h1 className="
text-3xl
font-black
">

¡Pedido recibido!

</h1>



<p className="
text-gray-500
mt-2
">

Gracias por tu compra.

</p>



<div className="
mt-6
bg-orange-50
rounded-2xl
p-5
">


<p className="
text-sm
font-bold
text-gray-500
">

NÚMERO DE PEDIDO

</p>



<p className="
text-3xl
font-black
text-orange-600
">

{order.order_number}

</p>


</div>


</div>





{/* SEGUIMIENTO */}



<div className="
bg-white
rounded-3xl
shadow-xl
p-6
mb-5
">


<h2 className="
text-xl
font-black
mb-4
">

📍 Seguimiento

</h2>



<a

href={trackingUrl}

className="
block
w-full
bg-orange-500
hover:bg-orange-600
text-white
text-center
py-5
rounded-full
font-black
text-lg
"

>

📍 Ver estado de mi pedido

</a>



<p className="
text-sm
text-gray-500
text-center
mt-4
">

Puedes consultar el avance cuando quieras.

</p>



</div>
{/* TRANSFERENCIA */}

{
order.payment_method==="TRANSFERENCIA"

&&

business

&&

(

<div className="
bg-teal-50
border
border-teal-200
rounded-3xl
p-6
mb-5
">


<h2 className="
text-xl
font-black
text-teal-700
mb-4
">

🏦 Datos de transferencia

</h2>


<p>
<b>Banco:</b>{" "}
{business.bank_name}
</p>


<p>
<b>Titular:</b>{" "}
{business.account_holder}
</p>


<p>
<b>Cuenta:</b>{" "}
{business.bank_account}
</p>


<p>
<b>CLABE:</b>{" "}
{business.bank_clabe}
</p>


</div>

)

}




{/* PRODUCTOS */}

<div className="
bg-white
rounded-3xl
shadow-xl
p-6
mb-5
">


<h2 className="
text-xl
font-black
mb-5
">

🛒 Tu pedido

</h2>


<div className="
space-y-3
">

{
order.order_items?.map((item)=>(

<div

key={item.id}

className="
bg-gray-50
rounded-2xl
p-4
flex
justify-between
gap-4
"

>

<div>

<p className="
font-black
text-gray-900
">

{item.product_name}

</p>


{
item.size &&

<p className="
text-sm
text-gray-500
">

{item.size}

</p>
}


<p className="
text-sm
text-gray-500
">

Cantidad: {item.quantity}

</p>


{
item.notes &&

<p className="
text-sm
text-gray-500
mt-1
">

Nota: {item.notes}

</p>

}

</div>


<p className="
font-black
text-gray-900
whitespace-nowrap
">

${Number(item.subtotal).toFixed(2)}

</p>


</div>

))

}

</div>




<div className="
border-t
mt-5
pt-5
flex
justify-between
">

<span className="
text-xl
font-black
">

TOTAL

</span>


<span className="
text-2xl
font-black
text-orange-600
">

${Number(order.total).toFixed(2)}

</span>

</div>


</div>




{/* VOLVER */}

<button

type="button"

onClick={()=>{

window.location.href="/";

}}

className="
w-full
bg-gray-900
hover:bg-gray-800
text-white
py-4
rounded-full
font-black
"

>

Volver al inicio

</button>


</div>

</main>

);

}