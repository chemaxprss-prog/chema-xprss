"use client";

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


console.log("CARGANDO ORDERS NUEVO");


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

(payload)=>{


console.log(
"CAMBIO PEDIDO:",
payload
);



loadOrders();


}

)


.subscribe((status, err)=>{

console.log("📡 STATUS:", status);

if(err){

console.log("❌ REALTIME ERROR:", err);

}

});





return ()=>{


supabase

.removeChannel(channel);


};


},[]);





async function loadOrders(){


const {data,error}=await supabase

.from("orders")

.select(`
*,
order_items(*),
payments(*)
`)

.order("created_at",{ascending:false});



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





const {error}=await supabase

.from("orders")

.update(updateData)

.eq("id",id);





if(error){

console.log(error);

alert("Error actualizando pedido");

setUpdating(null);

return;

}



setUpdating(null);
console.log("ENTRO USE EFFECT REALTIME");
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


switch(status){


case "PENDIENTE":

return "bg-red-600 text-white animate-pulse";


case "CONFIRMADO":

return "bg-blue-600 text-white";


case "PREPARANDO":

return "bg-yellow-400 text-gray-900";


case "LISTO":

return "bg-purple-600 text-white";


case "EN_CAMINO":

return "bg-indigo-600 text-white";


case "ENTREGADO":

return "bg-green-600 text-white";


default:

return "bg-gray-600 text-white";


}


}









function formatDate(date:string){


return new Date(date).toLocaleString("es-MX",{

day:"2-digit",

month:"short",

hour:"2-digit",

minute:"2-digit"

});


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

)

}




return (
<main className="
min-h-screen
bg-orange-50
p-6
pb-10
">


<div className="
max-w-6xl
mx-auto
">


<div className="mb-8">


<h1 className="
text-4xl
font-black
text-gray-900
">

Pedidos

</h1>


<p className="
text-gray-500
">

Panel administrativo CHEMA XPRSS

</p>


</div>






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
border
border-orange-100
"

>



{/* CABECERA */}


<div className="
bg-gray-900
p-5
text-white
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
mt-1
">

{formatDate(order.created_at)}

</p>



<div className="mt-4">


<span className={`
inline-flex
px-5
py-2
rounded-full
text-sm
font-black
shadow-lg

${statusStyle(order.status)}

`}>

{

order.status==="PENDIENTE"

&&

"🔴 "

}


{

order.status==="CONFIRMADO"

&&

"🔵 "

}


{

order.status==="PREPARANDO"

&&

"🟡 "

}


{

order.status==="LISTO"

&&

"🟣 "

}


{

order.status==="EN_CAMINO"

&&

"🔷 "

}


{

order.status==="ENTREGADO"

&&

"🟢 "

}



{order.status}

</span>


</div>



</div>









{/* INFORMACION CLIENTE */}


<div className="
p-5
">


<div className="
bg-orange-50
rounded-2xl
p-4
space-y-2
">


<p className="
font-bold
text-gray-900
">

👤 {order.customer_name}

</p>


<p className="
text-sm
text-gray-700
">

📱 {order.customer_phone}

</p>




<p className="
text-sm
text-gray-700
">

{

order.delivery_type==="Domicilio"

?

"🛵 Envío domicilio"

:

"🚶 Recoger negocio"

}

</p>



{

order.address &&

<p className="
text-sm
text-gray-700
">

📍 {order.address}

</p>


}


</div>









<h3 className="
mt-5
mb-3
font-black
text-gray-900
">

🍽 Productos

</h3>






<div className="
space-y-3
">


{

order.order_items?.map((item:any)=>(



<div

key={item.id}

className="
bg-gray-50
rounded-2xl
p-4
flex
justify-between
items-center
"


>


<div>


<p className="
font-bold
text-gray-900
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



<p className="
font-black
text-orange-600
">

${item.subtotal}

</p>



</div>



))


}



</div>









<div className="
mt-5
border-t
pt-4
flex
justify-between
items-center
">


<span className="
text-lg
font-black
">

TOTAL

</span>


<span className="
text-3xl
font-black
text-orange-600
">

${order.total || 0}

</span>


</div>



</div>









{/* ACCIONES */}


<div className="
bg-gray-50
p-5
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
hover:bg-orange-600
text-white
py-4
rounded-full
font-black
shadow-md
active:scale-95
transition
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
hover:bg-black
text-white
py-4
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
bg-white
border
border-gray-200
py-4
rounded-full
font-bold
text-gray-700
"

>

💬 WhatsApp cliente

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