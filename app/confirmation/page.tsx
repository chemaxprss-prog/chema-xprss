"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function ConfirmationPage(){


const searchParams = useSearchParams();

const router = useRouter();


const orderNumber = searchParams.get("order");


const [order,setOrder]=useState<any>(null);

const [items,setItems]=useState<any[]>([]);

const [payment,setPayment]=useState<any>(null);



useEffect(()=>{


async function loadOrder(){


if(!orderNumber) return;



const {data:orderData,error}=await supabase

.from("orders")

.select("*")

.eq("order_number",orderNumber)

.single();



if(error){

console.log(error);

return;

}



setOrder(orderData);





const {data:itemData}=await supabase

.from("order_items")

.select("*")

.eq("order_id",orderData.id);



setItems(itemData || []);





const {data:paymentData}=await supabase

.from("payment_settings")

.select("*")

.eq("active",true)

.single();



setPayment(paymentData);



}



loadOrder();



},[orderNumber]);







if(!order){


return (

<main className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
">

<p className="text-gray-700">

Cargando pedido...

</p>


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
max-w-md
mx-auto
space-y-5
">






{/* CABECERA */}

<div className="
bg-white
rounded-3xl
shadow-md
p-7
text-center
">


<div className="
w-20
h-20
mx-auto
rounded-full
bg-green-100
flex
items-center
justify-center
text-4xl
mb-4
">

✓

</div>



<h1 className="
text-3xl
font-extrabold
text-gray-900
">

Pedido recibido

</h1>



<p className="
text-gray-600
mt-2
">

Gracias por comprar en CHEMA XPRSS

</p>





<div className="
mt-5
bg-teal-600
rounded-3xl
p-4
text-white
">

<p className="text-sm">

Número de pedido

</p>


<h2 className="
text-3xl
font-extrabold
">

{order.order_number}

</h2>


</div>


</div>
<button

onClick={()=>router.push(

`/pedido/${order.order_number}`

)}

className="
mt-5
w-full
bg-orange-500
hover:bg-orange-600
text-white
py-4
rounded-full
font-extrabold
shadow-lg
active:scale-95
transition
"

>

🔎 Ver seguimiento de mi pedido

</button>








{/* PRODUCTOS */}

<div className="
bg-white
rounded-3xl
shadow-md
p-6
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Detalle del pedido

</h2>



{

items.map((item:any)=>(


<div

key={item.id}

className="
flex
justify-between
border-b
py-3
text-gray-800
"

>


<div>


<p className="font-bold">

{item.product_name}

</p>


<p className="text-sm text-gray-600">

{item.size} x {item.quantity}

</p>


</div>



<p className="font-bold">

${item.subtotal}

</p>


</div>


))


}





<div className="
flex
justify-between
mt-5
text-2xl
font-extrabold
">


<span>

Total

</span>


<span className="
text-orange-600
">

${order.total}

</span>


</div>



</div>








{/* ENTREGA */}

<div className="
bg-white
rounded-3xl
shadow-md
p-6
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-3
">

Entrega

</h2>



<p className="text-gray-800">

{
order.delivery_type==="Domicilio"

?

"🛵 Envío a domicilio"

:

"🚶 Recoger en negocio"

}

</p>



{

order.address &&

<p className="
mt-2
text-gray-600
">

{order.address}

</p>

}


</div>








{/* PAGO */}

<div className="
bg-white
rounded-3xl
shadow-md
p-6
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-3
">

Pago

</h2>




<p className="text-gray-800 font-bold">

{

order.payment_method==="TRANSFERENCIA"

?

"🏦 Transferencia"

:

"💵 Efectivo"

}


</p>



<p className="
mt-2
text-gray-600
">

Estado:

{order.payment_status}

</p>



</div>








{/* TRANSFERENCIA */}

{

order.payment_method==="TRANSFERENCIA" &&


<div className="
bg-orange-50
rounded-3xl
p-6
border
border-orange-200
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Datos de transferencia

</h2>



{

payment &&

<>

<p className="text-gray-800">

Banco:
{payment.bank_name}

</p>


<p className="text-gray-800">

Cuenta:
{payment.account_number}

</p>


<p className="text-gray-800">

Titular:
{payment.account_holder}

</p>

</>

}




<button

onClick={()=>router.push(
`/payment?order=${order.order_number}`
)}

className="
mt-5
w-full
bg-orange-500
hover:bg-orange-600
text-white
py-4
rounded-full
font-extrabold
shadow-lg
active:scale-95
transition
"

>

Subir comprobante

</button>



</div>


}









{/* EFECTIVO */}

{

order.payment_method==="EFECTIVO" &&


<div className="
bg-green-100
rounded-3xl
p-6
text-center
font-bold
text-green-800
">

Tu pedido será cobrado al momento de la entrega.

</div>


}






<button

onClick={()=>router.push("/")}

className="
w-full
bg-white
border
border-gray-200
py-4
rounded-full
font-bold
text-gray-700
shadow-sm
"

>

Volver al menú

</button>





</div>


</main>

);


}