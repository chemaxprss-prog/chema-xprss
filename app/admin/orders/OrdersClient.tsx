"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function AdminOrdersPage(){


const [orders,setOrders]=useState<any[]>([]);

const [loading,setLoading]=useState(true);

const [updating,setUpdating]=useState<number|null>(null);


const [filter,setFilter]=useState("TODOS");


const [search,setSearch]=useState("");





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








const counts = {


TODOS:
orders.length,


PENDIENTE:
orders.filter(
(o)=>o.status==="PENDIENTE"
).length,


CONFIRMADO:
orders.filter(
(o)=>o.status==="CONFIRMADO"
).length,


PREPARANDO:
orders.filter(
(o)=>o.status==="PREPARANDO"
).length,


LISTO:
orders.filter(
(o)=>o.status==="LISTO"
).length,


ENTREGADO:
orders.filter(
(o)=>o.status==="ENTREGADO"
).length,


};








const filteredOrders = orders.filter((order)=>{


const matchesStatus =

filter==="TODOS"

?

true

:

order.status===filter;





const text = search
.toLowerCase()
.trim();





const matchesSearch =

text===""

?

true

:

order.order_number
?.toLowerCase()
.includes(text)

||

order.customer_name
?.toLowerCase()
.includes(text)

||

order.customer_phone
?.includes(text);






return (

matchesStatus

&&

matchesSearch

);


});









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

updateData.payment_status =
paymentStatus;

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








function sendDeliveryWhatsApp(order:any){


const phone =
order.customer_phone.replace(
 /\D/g,
""
);



const message =

order.delivery_type==="Domicilio"

?

`Hola ${order.customer_name} 👋

Tu pedido ${order.order_number} ya va en camino 🛵

Gracias por comprar en CHEMA XPRSS 🍤`

:

`Hola ${order.customer_name} 👋

Tu pedido ${order.order_number} ya está listo para recoger.

Gracias por comprar en CHEMA XPRSS.`;





const url =

`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;



window.open(
url,
"_blank"
);


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

text:
order.delivery_type==="Domicilio"

?

"Enviar pedido"

:

"Avisar listo para recoger",

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
"bg-red-100 text-red-700",


CONFIRMADO:
"bg-blue-100 text-blue-700",


PREPARANDO:
"bg-yellow-100 text-yellow-700",


LISTO:
"bg-purple-100 text-purple-700",


EN_CAMINO:
"bg-indigo-100 text-indigo-700",


ENTREGADO:
"bg-green-100 text-green-700"


};


return styles[status] || "bg-gray-100 text-gray-700";


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
p-5
">



<div className="
max-w-7xl
mx-auto
">





<h1 className="
text-3xl
font-black
text-gray-900
mb-1
">

Control de pedidos CHEMA XPRSS

</h1>



<p className="
text-gray-500
mb-6
">

Gestiona y actualiza tus pedidos

</p>







{/* BUSCADOR */}



<div className="
bg-white
rounded-2xl
shadow-sm
p-4
mb-5
">


<input

type="text"

placeholder="🔎 Buscar pedido, cliente o teléfono..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

className="
w-full
border
rounded-xl
p-4
outline-none
focus:ring-2
focus:ring-orange-400
"

/>


</div>








{/* FILTROS */}



<div className="
flex
flex-wrap
gap-3
mb-8
">





{

[

["TODOS","Todos","bg-gray-100 text-gray-700"],

["PENDIENTE","Pendientes","bg-red-100 text-red-700"],

["CONFIRMADO","Confirmados","bg-blue-100 text-blue-700"],

["PREPARANDO","Preparando","bg-yellow-100 text-yellow-700"],

["LISTO","Listos","bg-purple-100 text-purple-700"],

["ENTREGADO","Entregados","bg-green-100 text-green-700"]

].map((item:any)=>(



<button

key={item[0]}

onClick={()=>setFilter(item[0])}

className={`

px-5
py-3
rounded-full
font-black
text-sm
transition

${item[2]}

${

filter===item[0]

?

"ring-2 ring-gray-900 scale-105"

:

""

}

`}

>


{item[1]}

&nbsp;

<span>

{counts[item[0]]}

</span>



</button>


))


}




</div>









<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">







{

filteredOrders.map((order:any)=>{


const action =
nextAction(order);





return (

<div

key={order.id}

className="
bg-white
rounded-3xl
shadow-lg
overflow-hidden
"

>





<div className="
p-5
border-b
">


<div className="
flex
justify-between
items-start
">


<div>

<h2 className="
text-xl
font-black
">

🧾 {order.order_number}

</h2>


<p className="
text-sm
text-gray-500
">

{formatDate(order.created_at)}

</p>


</div>






<span className={`

px-3
py-1
rounded-full
text-xs
font-black

${statusStyle(order.status)}

`}>

{order.status}

</span>



</div>



</div>








<div className="
p-5
space-y-4
">






<div>


<p className="
font-black
">

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







<div>


<h3 className="
font-black
mb-2
">

🍽 Productos

</h3>




{

order.order_items?.map((item:any)=>(


<div

key={item.id}

className="
bg-gray-50
rounded-xl
p-3
mb-2
flex
justify-between
"

>


<div>

<p className="
font-bold
">

{item.product_name}

</p>


<p className="
text-sm
text-gray-500
">

{item.size} x {item.quantity}

</p>


</div>



<b>

${item.subtotal}

</b>


</div>


))


}




</div>







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
bg-gray-50
p-5
space-y-3
">






{

action &&


<button

disabled={updating===order.id}

onClick={async()=>{


await updateOrderStatus(

order.id,

action.next

);



if(action.next==="EN_CAMINO"){

sendDeliveryWhatsApp(order);

}



}}


className="
w-full
bg-orange-500
hover:bg-orange-600
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

rel="noopener noreferrer"

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





{

filteredOrders.length===0 &&


<div className="
col-span-full
bg-white
rounded-3xl
p-10
text-center
font-bold
text-gray-500
">

No hay pedidos encontrados


</div>


}



</div>





</div>


</main>


);


}