"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoutButton from "@/components/LogoutButton";


export default function AdminMenu({

role

}:{

role?: string

}){


const pathname = usePathname();


const [pending,setPending] = useState(0);

const [kitchen,setKitchen] = useState(0);

const [alertsEnabled,setAlertsEnabled] = useState(false);





useEffect(()=>{


loadCounters();



const channel = supabase

.channel(`admin-menu-${Date.now()}`)


.on(

"postgres_changes",

{

event:"INSERT",

schema:"public",

table:"orders"

},

(payload)=>{


console.log(
"🔔 NUEVO PEDIDO:",
payload
);



if(alertsEnabled){


const audio = new Audio(
"/sounds/new-order.mp3"
);


audio.play()

.catch((error)=>{

console.log(
"Audio bloqueado:",
error
);

});


}



loadCounters();


}

)



.on(

"postgres_changes",

{

event:"UPDATE",

schema:"public",

table:"orders"

},

()=>{


loadCounters();


}

)


.subscribe((status)=>{


console.log(
"📡 MENU STATUS:",
status
);


});





return ()=>{


supabase.removeChannel(channel);


};



},[alertsEnabled]);









async function loadCounters(){


const {

data,

error

}=await supabase

.from("orders")

.select("status");



if(error){

console.log(error);

return;

}




setPending(

data.filter(

(order:any)=>

order.status==="PENDIENTE"

).length

);



setKitchen(

data.filter(

(order:any)=>

order.status==="PREPARANDO"

).length

);



}








function enableAlerts(){


const audio = new Audio(

"/sounds/new-order.mp3"

);



audio.play()

.then(()=>{


setAlertsEnabled(true);


})

.catch((error)=>{


console.log(
"Error activando audio:",
error
);


});


}









const links = [


{
name:"📊 Dashboard",
href:"/admin",
roles:[
"superadmin",
"admin",
"cajero",
"cocina"
]
},



{
name:"🛒 Pedidos",
href:"/admin/orders",
badge:pending,
roles:[
"superadmin",
"admin",
"cajero",
"cocina"
]
},



{
name:"💰 Caja",
href:"/admin/pos",
roles:[
"superadmin",
"admin",
"cajero"
]
},



{
name:"🍳 Cocina",
href:"/admin/kitchen",
badge:kitchen,
roles:[
"superadmin",
"admin",
"cocina"
]
},



{
name:"🍤 Productos",
href:"/admin/products",
roles:[
"superadmin",
"admin"
]
},



{
name:"📂 Categorías",
href:"/admin/categories",
roles:[
"superadmin",
"admin"
]
},



{
name:"👥 Clientes",
href:"/admin/customers",
roles:[
"superadmin",
"admin",
"cajero"
]
},



{
name:"📈 Reportes",
href:"/admin/reports",
roles:[
"superadmin",
"admin"
]
},



{
name:"🏢 Negocios",
href:"/admin/businesses",
roles:[
"superadmin"
]
},



{
name:"👤 Usuarios",
href:"/admin/users",
roles:[
"superadmin"
]
},



{
name:"⚙️ Configuración",
href:"/admin/settings",
roles:[
"superadmin",
"admin"
]
}



];








const visibleLinks = links.filter(

(link:any)=>

link.roles.includes(role || "")

);









return(


<nav className="
space-y-2
">





{

visibleLinks.map((link:any)=>(



<Link


key={link.href}


href={link.href}


className={`

flex

justify-between

items-center

p-3

rounded-xl

font-bold

transition


${

pathname===link.href

?

"bg-teal-600 text-white"

:

"bg-gray-100 text-gray-700 hover:bg-teal-100"

}

`}


>



<span>

{link.name}

</span>





{

link.badge > 0 &&


<span className="

bg-red-500

text-white

text-xs

font-black

px-3

py-1

rounded-full

">

{link.badge}

</span>


}



</Link>



))


}







<button

onClick={enableAlerts}

className="

w-full

mt-4

p-3

rounded-xl

font-bold

bg-orange-500

text-white

hover:bg-orange-600

transition

"

>


{

alertsEnabled

?

"🔔 Alertas activadas"

:

"🔔 Activar alertas"

}


</button>





<LogoutButton />



</nav>


);


}