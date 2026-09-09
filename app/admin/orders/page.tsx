"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export const dynamic = "force-dynamic";


export default function AdminOrdersPage(){

const [orders,setOrders]=useState<any[]>([]);
const [loading,setLoading]=useState(true);
const [updating,setUpdating]=useState<number|null>(null);



useEffect(()=>{

loadOrders();


const channel = supabase

.channel("orders-realtime")

.on(

"postgres_changes",

{
event:"*",
schema:"public",
table:"orders"
},

()=>{

loadOrders();

}

)

.subscribe();



return ()=>{

supabase.removeChannel(channel);

};


},[]);





async function loadOrders(){


const {

data,

error

}=await supabase

.from("orders")

.select(`
*,
order_items(*),
payments(*)
`)

.order(
"created_at",
{
ascending:false
}

);



if(error){

console.log(error);

return;

}



setOrders(data || []);

setLoading(false);


}







async function updateOrderStatus(

id:number,

status:string,

paymentStatus?:string

){


setUpdating(id);



const updateData:any={

status

};



if(paymentStatus){

updateData.payment_status=paymentStatus;

}




const {

error

}=await supabase

.from("orders")

.update(updateData)

.eq(
"id",
id
);




if(error){

alert(
"Error actualizando pedido"
);

console.log(error);

setUpdating(null);

return;

}




setUpdating(null);

loadOrders();


}







function nextAction(order:any){


switch(order.status){


case "PENDIENTE":

return {
text:"Aceptar pedido",
next:"CONFIRMADO"
};


case "CONFIRMADO":

return {
text:"Preparar pedido",
next:"PREPARANDO"
};


case "PREPARANDO":

return {
text:"Marcar listo",
next:"LISTO"
};


case "LISTO":

return {
text:"Enviar pedido",
next:"EN_CAMINO"
};


case "EN_CAMINO":

return {
text:"Entregar pedido",
next:"ENTREGADO"
};


default:

return null;


}


}







function statusStyle(status:string){


const styles:any={

PENDIENTE:
"bg-red-600 text-white",

CONFIRMADO:
"bg-blue-600 text-white",

PREPARANDO:
"bg-yellow-400 text-gray-900",

LISTO:
"bg-purple-600 text-white",

EN_CAMINO:
"bg-indigo-600 text-white",

ENTREGADO:
"bg-green-600 text-white"

};


return styles[status] || "bg-gray-600 text-white";


}







function formatDate(date:string){

return new Date(date).toLocaleString(
"es-MX",
{

day:"2-digit",
month:"short",
hour:"2-digit",
minute:"2-digit"

}

);

}







if(loading){

return (

<main className="
min-h-screen
bg-orange-50
flex
items-center
justify-center
font-bold
">

Cargando pedidos...

</main>

);

}








return (

<main className="
min-h-screen
bg-orange-50
p-6
">

<div className="
max-w-6xl
mx-auto
">


<h1 className="
text-4xl
font-black
mb-2
">

Pedidos

</h1>


<p className="
text-gray-500
mb-8
">

Panel administrativo CHEMA XPRSS

</p>





<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">



{

orders.map((order:any)=>{


const action=nextAction(order);



return (

<div

key={order.id}

className="
bg-white
rounded-3xl
shadow-xl
overflow-hidden
"

>



<div className="
bg-gray-900
text-white
p-5
">


<h2 className="
text-xl
font-black
">

🧾 {order.order_number}

</h2>


<p className="
text-gray-400
text-sm
">

{formatDate(order.created_at)}

</p>



<span className={`

inline-block
mt-4
px-4
py-2
rounded-full
font-bold

${statusStyle(order.status)}

`}>

{order.status}

</span>


</div>






<div className="
p-5
space-y-4
">


<div>

<p className="font-bold">

👤 {order.customer_name}

</p>


<p>

📱 {order.customer_phone}

</p>


<p>

{

order.delivery_type==="Domicilio"

?

"🛵 Domicilio"

:

"🚶 Recoger"

}

</p>


</div>






<h3 className="
font-black
">

🍽 Productos

</h3>




{

order.order_items?.map((item:any)=>(

<div

key={item.id}

className="
bg-gray-100
rounded-xl
p-3
flex
justify-between
"

>

<span>

{item.product_name}

<br/>

{item.size} x {item.quantity}

</span>


<b>

${item.subtotal}

</b>


</div>


))

}






<div className="
border-t
pt-4
flex
justify-between
font-black
text-xl
">


<span>

TOTAL

</span>


<span className="
text-orange-600
">

${order.total}

</span>


</div>



</div>







<div className="
p-5
bg-gray-50
space-y-3
">



{

action &&

<button

disabled={updating===order.id}

onClick={()=>updateOrderStatus(
order.id,
action.next
)}

className="
w-full
bg-orange-500
text-white
py-3
rounded-full
font-black
"

>

{

updating===order.id

?

"Actualizando..."

:

action.text

}

</button>

}






{

order.payment_method==="TRANSFERENCIA"

&&

order.payment_status!=="PAGADO"

&&

<button

onClick={()=>updateOrderStatus(
order.id,
order.status,
"PAGADO"
)}

className="
w-full
bg-gray-900
text-white
py-3
rounded-full
font-black
"

>

Confirmar pago

</button>

}




<a

href={`https://wa.me/${order.customer_phone}`}

target="_blank"

className="
block
text-center
border
py-3
rounded-full
font-bold
"

>

💬 WhatsApp

</a>



</div>



</div>


)


})


}



</div>


</div>


</main>

);


}