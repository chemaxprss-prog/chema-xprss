"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


export default function AdminDashboard(){


const [stats,setStats]=useState({

pendientes:0,

preparando:0,

listos:0,

entregados:0,

ventas:0

});


const [loading,setLoading]=useState(true);




useEffect(()=>{

loadStats();

},[]);





async function loadStats(){


const {data,error}=await supabase

.from("orders")

.select("*");



if(error){

console.log(error);

return;

}



const today=new Date();

const todayOrders=data?.filter((order:any)=>{


const date=new Date(order.created_at);


return (

date.getDate()===today.getDate()

&&

date.getMonth()===today.getMonth()

&&

date.getFullYear()===today.getFullYear()

);


}) || [];





setStats({

pendientes:

todayOrders.filter((o:any)=>

o.status==="PENDIENTE"

).length,



preparando:

todayOrders.filter((o:any)=>

o.status==="PREPARANDO"

).length,



listos:

todayOrders.filter((o:any)=>

o.status==="LISTO"

).length,



entregados:

todayOrders.filter((o:any)=>

o.status==="ENTREGADO"

).length,



ventas:

todayOrders.reduce(

(sum:number,o:any)=>

sum + Number(o.total || 0),

0

)


});



setLoading(false);


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

Cargando dashboard...

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

CHEMA XPRSS

</h1>


<p className="
text-gray-500
mt-1
">

Panel administrativo

</p>


</div>







{/* RESUMEN */}

<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-5
mb-8
">





<div className="
bg-red-600
rounded-3xl
p-6
text-white
shadow-lg
">


<p className="
text-sm
font-bold
opacity-90
">

🔴 Pendientes

</p>


<h2 className="
text-4xl
font-black
mt-2
">

{stats.pendientes}

</h2>


</div>






<div className="
bg-yellow-400
rounded-3xl
p-6
text-gray-900
shadow-lg
">


<p className="
text-sm
font-bold
">

🟡 Preparando

</p>


<h2 className="
text-4xl
font-black
mt-2
">

{stats.preparando}

</h2>


</div>







<div className="
bg-purple-600
rounded-3xl
p-6
text-white
shadow-lg
">


<p className="
text-sm
font-bold
">

🟣 Listos

</p>


<h2 className="
text-4xl
font-black
mt-2
">

{stats.listos}

</h2>


</div>








<div className="
bg-green-600
rounded-3xl
p-6
text-white
shadow-lg
">


<p className="
text-sm
font-bold
">

🟢 Entregados

</p>


<h2 className="
text-4xl
font-black
mt-2
">

{stats.entregados}

</h2>


</div>






</div>








{/* VENTAS */}


<div className="
bg-gray-900
rounded-3xl
p-7
text-white
shadow-xl
mb-8
">


<p className="
text-gray-300
font-bold
">

Ventas de hoy

</p>


<h2 className="
text-5xl
font-black
text-orange-400
mt-2
">

${stats.ventas}

</h2>


</div>









{/* ACCESOS */}


<h2 className="
text-2xl
font-black
text-gray-900
mb-5
">

Accesos rápidos

</h2>





<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-5
">





<Link

href="/admin/orders"

className="
bg-white
rounded-3xl
p-6
shadow-md
border
border-orange-100
hover:shadow-xl
transition
"

>

<p className="
text-3xl
">

📦

</p>


<h3 className="
font-black
text-xl
mt-3
">

Pedidos

</h3>


<p className="
text-gray-500
text-sm
">

Gestionar órdenes

</p>


</Link>









<Link

href="/admin/products"

className="
bg-white
rounded-3xl
p-6
shadow-md
border
border-orange-100
hover:shadow-xl
transition
"

>

<p className="
text-3xl
">

🍽

</p>


<h3 className="
font-black
text-xl
mt-3
">

Productos

</h3>


<p className="
text-gray-500
text-sm
">

Administrar menú

</p>


</Link>








<Link

href="/admin/categories"

className="
bg-white
rounded-3xl
p-6
shadow-md
border
border-orange-100
hover:shadow-xl
transition
"

>

<p className="
text-3xl
">

📂

</p>


<h3 className="
font-black
text-xl
mt-3
">

Categorías

</h3>


<p className="
text-gray-500
text-sm
">

Organizar menú

</p>


</Link>








<Link

href="/admin/customers"

className="
bg-white
rounded-3xl
p-6
shadow-md
border
border-orange-100
hover:shadow-xl
transition
"

>

<p className="
text-3xl
">

👥

</p>


<h3 className="
font-black
text-xl
mt-3
">

Clientes

</h3>


<p className="
text-gray-500
text-sm
">

Ver clientes

</p>


</Link>









<Link

href="/admin/settings"

className="
bg-white
rounded-3xl
p-6
shadow-md
border
border-orange-100
hover:shadow-xl
transition
"

>

<p className="
text-3xl
">

⚙️

</p>


<h3 className="
font-black
text-xl
mt-3
">

Configuración

</h3>


<p className="
text-gray-500
text-sm
">

Datos del negocio

</p>


</Link>






</div>






</div>


</main>


);


}