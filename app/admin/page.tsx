"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";



export default function AdminOrdersPage(){


const [orders,setOrders]=useState<any[]>([]);

const [filteredOrders,setFilteredOrders]=useState<any[]>([]);

const [loading,setLoading]=useState(true);

const [updating,setUpdating]=useState<number|null>(null);

const [filter,setFilter]=useState("TODOS");





useEffect(()=>{

loadOrders();


const channel = supabase

.channel("orders-page-realtime")


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











useEffect(()=>{


if(filter==="TODOS"){


setFilteredOrders(orders);


return;


}



setFilteredOrders(

orders.filter(

(order:any)=>order.status===filter

)

);



},[filter,orders]);






async function loadOrders(){



const {data,error}=await supabase

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


console.log(

"ERROR CARGANDO PEDIDOS:",

error

);



setLoading(false);


return;


}




setOrders(data || []);

setFilteredOrders(data || []);

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


alert(
"Error actualizando pedido"
);


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


switch(status){


case "PENDIENTE":

return "bg-red-600 text-white";


case "CONFIRMADO":

return "bg-blue-600 text-white";


case "PREPARANDO":

return "bg-orange-500 text-white";


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








function countStatus(status:string){


return orders.filter(

(order:any)=>order.status===status

).length;


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
pb-12
">


<div className="
max-w-7xl
mx-auto
">



<h1 className="
text-4xl
font-black
text-gray-900
mb-2
">

Pedidos

</h1>


<p className="
text-gray-500
mb-8
">

Control de pedidos CHEMA XPRSS

</p>





<div className="
grid
grid-cols-2
md:grid-cols-3
xl:grid-cols-6
gap-4
mb-8
">


{[

{
name:"Todos",
value:"TODOS",
count:orders.length,
color:"border-gray-300"
},

{
name:"Pendientes",
value:"PENDIENTE",
count:countStatus("PENDIENTE"),
color:"border-red-400"
},

{
name:"Confirmados",
value:"CONFIRMADO",
count:countStatus("CONFIRMADO"),
color:"border-blue-400"
},

{
name:"Preparando",
value:"PREPARANDO",
count:countStatus("PREPARANDO"),
color:"border-orange-400"
},

{
name:"Listos",
value:"LISTO",
count:countStatus("LISTO"),
color:"border-purple-400"
},

{
name:"Entregados",
value:"ENTREGADO",
count:countStatus("ENTREGADO"),
color:"border-green-400"
}


].map((item:any)=>(


<button

key={item.value}

onClick={()=>setFilter(item.value)}

className={`

bg-white

rounded-3xl

p-4

shadow-md

border-2

${item.color}

${

filter===item.value

?

"scale-105"

:

""

}

`}

>


<p className="
text-sm
font-bold
text-gray-600
">

{item.name}

</p>


<p className="
text-3xl
font-black
">

{item.count}

</p>


</button>


))}


</div>
{filteredOrders.map((order:any)=>(

<div

key={order.id}

className="
bg-white
rounded-3xl
shadow-md
p-6
mb-5
"

>


<div className="
flex
justify-between
items-start
mb-4
">


<div>

<h2 className="
text-xl
font-black
">

Pedido #{order.id}

</h2>


<p className="
text-gray-500
text-sm
">

{formatDate(order.created_at)}

</p>

</div>



<span

className={`

px-4

py-2

rounded-full

text-sm

font-bold

${statusStyle(order.status)}

`}

>

{order.status}

</span>


</div>





<div className="
space-y-3
mb-5
">


{order.order_items?.map((item:any)=>(


<div

key={item.id}

className="
flex
justify-between
border-b
pb-2
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

{item.size}

x {item.quantity}

</p>


</div>



<p className="
font-black
">

${item.subtotal}

</p>



</div>


))}


</div>





<div className="
flex
justify-between
items-center
mb-5
">


<p className="
text-2xl
font-black
">

Total: ${order.total}

</p>


</div>





{

nextAction(order) &&

(

<button

disabled={updating===order.id}

onClick={()=>{

const action=nextAction(order);

if(action){

updateOrderStatus(

order.id,

action.next

);

}

}}

className="
w-full
bg-black
text-white
py-3
rounded-xl
font-bold
"


>

{

updating===order.id

?

"Actualizando..."

:

nextAction(order)?.text

}


</button>


)

}



</div>


))}



</div>


</main>


)


}