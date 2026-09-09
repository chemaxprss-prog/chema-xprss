"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function KitchenPage(){


const [orders,setOrders]=useState<any[]>([]);

const [loading,setLoading]=useState(true);

const [updating,setUpdating]=useState<number|null>(null);





useEffect(()=>{


loadOrders();



const channel = supabase

.channel("kitchen-realtime")


.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"orders"

},

(payload)=>{


console.log(
"🔥 KITCHEN CAMBIO:",
payload
);


loadOrders();


}

)


.subscribe((status)=>{


console.log(
"📡 KITCHEN STATUS:",
status
);


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
order_items(*)
`)

.in("status",[

"PENDIENTE",

"PREPARANDO",

"LISTO"

])

.order("created_at",{ascending:false});




if(error){

console.log(error);

return;

}



setOrders(data || []);

setLoading(false);


}









async function updateStatus(

id:number,

status:string

){


setUpdating(id);




const {error}=await supabase

.from("orders")

.update({

status

})

.eq("id",id);




if(error){

console.log(error);

setUpdating(null);

return;

}



setUpdating(null);

loadOrders();


}









function getOrders(status:string){


return orders.filter(

(order:any)=>order.status===status

);


}









function statusColor(status:string){


switch(status){


case "PENDIENTE":

return "border-red-400";


case "PREPARANDO":

return "border-orange-400";


case "LISTO":

return "border-green-400";


default:

return "border-gray-200";


}


}








function nextButton(order:any){


if(order.status==="PENDIENTE"){


return {

text:"🔥 Empezar preparación",

next:"PREPARANDO"

};


}



if(order.status==="PREPARANDO"){


return {

text:"✅ Marcar listo",

next:"LISTO"

};


}



return null;


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

Cargando cocina...

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
max-w-7xl
mx-auto
">



<h1 className="
text-4xl
font-black
text-gray-900
mb-2
">

🍳 Cocina CHEMA XPRSS

</h1>


<p className="
text-gray-500
mb-8
">

Panel de preparación

</p>








<div className="
grid
grid-cols-1
lg:grid-cols-3
gap-6
">







{/* NUEVOS */}


<div className="
bg-white
rounded-3xl
p-5
shadow-lg
border-t-4
border-red-500
">


<h2 className="
text-2xl
font-black
text-red-600
mb-5
">

🔴 Nuevos

</h2>




<div className="
space-y-5
">


{

getOrders("PENDIENTE").map((order:any)=>(


<div

key={order.id}

className="
bg-red-50
rounded-2xl
p-5
border
border-red-200
"

>


<h3 className="
text-xl
font-black
">

{order.order_number}

</h3>



<div className="
mt-4
space-y-3
">


{

order.order_items?.map((item:any)=>(


<div

key={item.id}

className="
bg-white
rounded-xl
p-3
"

>


<p className="
font-bold
">

{item.product_name}

</p>


<p className="
text-gray-500
text-sm
">

{item.size} x {item.quantity}

</p>


</div>


))


}



</div>





<button

disabled={updating===order.id}

onClick={()=>updateStatus(

order.id,

"PREPARANDO"

)}

className="
mt-5
w-full
bg-orange-500
text-white
py-3
rounded-full
font-black
"

>

🔥 Empezar

</button>



</div>


))


}



</div>


</div>









{/* PREPARANDO */}


<div className="
bg-white
rounded-3xl
p-5
shadow-lg
border-t-4
border-orange-500
">


<h2 className="
text-2xl
font-black
text-orange-600
mb-5
">

🟠 Preparando

</h2>




<div className="
space-y-5
">


{

getOrders("PREPARANDO").map((order:any)=>(


<div

key={order.id}

className="
bg-orange-50
rounded-2xl
p-5
border
border-orange-200
"

>


<h3 className="
text-xl
font-black
">

{order.order_number}

</h3>



<div className="
mt-4
space-y-3
">


{

order.order_items?.map((item:any)=>(


<div

key={item.id}

className="
bg-white
rounded-xl
p-3
"

>


<p className="
font-bold
">

{item.product_name}

</p>


<p className="
text-gray-500
text-sm
">

{item.size} x {item.quantity}

</p>


</div>


))


}



</div>





<button

disabled={updating===order.id}

onClick={()=>updateStatus(

order.id,

"LISTO"

)}

className="
mt-5
w-full
bg-green-600
text-white
py-3
rounded-full
font-black
"

>

✅ Marcar listo

</button>



</div>


))


}



</div>


</div>









{/* LISTOS */}


<div className="
bg-white
rounded-3xl
p-5
shadow-lg
border-t-4
border-green-500
">


<h2 className="
text-2xl
font-black
text-green-600
mb-5
">

🟢 Listos

</h2>




<div className="
space-y-5
">


{

getOrders("LISTO").map((order:any)=>(


<div

key={order.id}

className="
bg-green-50
rounded-2xl
p-5
border
border-green-200
"

>


<h3 className="
text-xl
font-black
">

{order.order_number}

</h3>



<div className="
mt-4
space-y-3
">


{

order.order_items?.map((item:any)=>(


<div

key={item.id}

className="
bg-white
rounded-xl
p-3
"

>


<p className="
font-bold
">

{item.product_name}

</p>


<p className="
text-gray-500
text-sm
">

{item.size} x {item.quantity}

</p>


</div>


))


}



</div>




<p className="
mt-5
text-center
font-black
text-green-700
">

Pedido listo para entrega

</p>



</div>


))


}



</div>


</div>







</div>


</div>


</main>


);


}