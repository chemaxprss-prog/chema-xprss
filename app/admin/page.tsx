"use client";

import Link from "next/link";


export default function AdminDashboard(){


const options = [

{
title:"🍤 Productos",
description:"Administrar menú y productos",
url:"/admin/products",
color:"bg-teal-600"
},

{
title:"🔥 Combos",
description:"Crear promociones y paquetes",
url:"/admin/combos",
color:"bg-orange-500"
},

{
title:"📦 Pedidos",
description:"Control y seguimiento de pedidos",
url:"/admin/orders",
color:"bg-black"
},

{
title:"👥 Clientes",
description:"Administrar clientes",
url:"/admin/customers",
color:"bg-blue-600"
},

{
title:"📊 Reportes",
description:"Ventas y estadísticas",
url:"/admin/reports",
color:"bg-purple-600"
},

{
title:"⚙️ Configuración",
description:"Ajustes del negocio",
url:"/admin/settings",
color:"bg-gray-700"
}


];





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
text-gray-900
mb-2
">

Panel Administrativo

</h1>


<p className="
text-gray-600
mb-8
">

Control CHEMA XPRSS

</p>





<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">


{

options.map((item)=>(


<Link

key={item.url}

href={item.url}

className={`
${item.color}

text-white

rounded-3xl

p-6

shadow-lg

hover:scale-105

transition

`}

>


<h2 className="
text-2xl
font-black
">

{item.title}

</h2>


<p className="
mt-2
opacity-90
">

{item.description}

</p>



</Link>


))


}



</div>


</div>


</main>


);


}