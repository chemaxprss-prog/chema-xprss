"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";



export default function CustomerDetailPage(){


const params = useParams();

const id = String(params.id);



const [customer,setCustomer]=useState<any>(null);

const [orders,setOrders]=useState<any[]>([]);

const [loading,setLoading]=useState(true);







useEffect(()=>{


if(id){

loadCustomer();

}


},[id]);








async function loadCustomer(){



const {data:customerData,error:customerError}=await supabase

.from("customers")

.select("*")

.eq("id",id)

.single();





if(customerError){

console.log(customerError);

return;

}







const {data:ordersData,error:ordersError}=await supabase

.from("orders")

.select("*")

.eq("customer_id",id)

.order("created_at",{ascending:false});







if(ordersError){

console.log(ordersError);

return;

}






setCustomer(customerData);

setOrders(ordersData || []);

setLoading(false);



}









function statusStyle(status:string){


switch(status){


case "PENDIENTE":

return "bg-orange-100 text-orange-700";


case "CONFIRMADO":

return "bg-blue-100 text-blue-700";


case "PREPARANDO":

return "bg-yellow-100 text-yellow-700";


case "LISTO":

return "bg-purple-100 text-purple-700";


case "EN_CAMINO":

return "bg-indigo-100 text-indigo-700";


case "ENTREGADO":

return "bg-green-100 text-green-700";


default:

return "bg-gray-100 text-gray-700";


}


}








if(loading){


return (

<main className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
">

Cargando cliente...

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
max-w-4xl
mx-auto
space-y-5
">







{/* CABECERA CLIENTE */}

<div className="
bg-white
rounded-3xl
shadow-md
p-6
">



<div className="
flex
items-center
gap-4
">


<div className="
w-16
h-16
rounded-full
bg-teal-100
flex
items-center
justify-center
text-3xl
">

👤

</div>



<div>

<h1 className="
text-3xl
font-extrabold
text-gray-900
">

{customer.name}

</h1>


<p className="
text-gray-600
">

Cliente CHEMA XPRSS

</p>


</div>


</div>







<div className="
mt-6
bg-gray-50
rounded-2xl
p-5
space-y-3
">


<p>

📱 <strong>WhatsApp:</strong>

<br/>

{customer.phone}

</p>




{

customer.address &&


<p>

📍 <strong>Dirección:</strong>

<br/>

{customer.address}

</p>


}



</div>








<a

href={`https://wa.me/${customer.phone}`}

target="_blank"

className="
mt-5
block
text-center
bg-green-600
text-white
py-4
rounded-full
font-bold
"

>

💬 Contactar cliente

</a>





</div>









{/* RESUMEN */}

<div className="
grid
grid-cols-1
md:grid-cols-3
gap-4
">





<div className="
bg-white
rounded-3xl
shadow-md
p-5
">

<p className="text-gray-500">

Pedidos realizados

</p>


<h2 className="
text-3xl
font-extrabold
text-teal-700
">

{customer.total_orders || orders.length}

</h2>


</div>







<div className="
bg-white
rounded-3xl
shadow-md
p-5
">

<p className="text-gray-500">

Total comprado

</p>


<h2 className="
text-3xl
font-extrabold
text-orange-600
">

${customer.total_spent || 0}

</h2>


</div>







<div className="
bg-white
rounded-3xl
shadow-md
p-5
">

<p className="text-gray-500">

Última compra

</p>


<h2 className="
text-xl
font-extrabold
text-gray-900
">

{

orders[0]

?

new Date(
orders[0].created_at
).toLocaleDateString()

:

"Sin compras"

}


</h2>


</div>






</div>









{/* HISTORIAL */}

<div>


<h2 className="
text-2xl
font-extrabold
text-teal-700
mb-4
">

Historial de pedidos

</h2>






{

orders.length===0 &&


<div className="
bg-white
rounded-3xl
p-6
shadow-md
">

No tiene pedidos todavía.

</div>


}








<div className="space-y-4">


{

orders.map(order=>(


<div

key={order.id}

className="
bg-white
rounded-3xl
shadow-md
p-6
"

>



<div className="
flex
justify-between
items-center
mb-4
">


<h3 className="
text-xl
font-extrabold
text-teal-700
">

{order.order_number}

</h3>



<span className={`
px-3
py-1
rounded-full
font-bold
text-sm
${statusStyle(order.status)}
`}>

{order.status}

</span>



</div>






<div className="
space-y-2
text-gray-800
">


<p>

📅 Fecha:

{" "}

{new Date(order.created_at).toLocaleDateString()}

</p>



<p>

💰 Total:

{" "}

<strong>

${order.total}

</strong>

</p>



<p>

💳 Pago:

{" "}

{order.payment_status}

</p>



</div>





</div>



))


}



</div>



</div>






</div>


</main>


);


}