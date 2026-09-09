"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


interface Props {

orderId:number;

initialStatus:string;

}


export default function OrderTracker({

orderId,

initialStatus

}:Props){


const [status,setStatus]=useState(initialStatus);




useEffect(()=>{


const channel=supabase

.channel("order-status-"+orderId)


.on(

"postgres_changes",

{

event:"UPDATE",

schema:"public",

table:"orders",

filter:`id=eq.${orderId}`

},

(payload)=>{


const nuevoEstado = payload.new.status;


setStatus(nuevoEstado);


}

)


.subscribe();





return ()=>{


supabase.removeChannel(channel);


};


},[orderId]);







const estados:any={


PENDIENTE:{

icon:"📥",

titulo:"Pedido recibido"

},


LISTO_PARA_ENTREGA:{

icon:"🍤",

titulo:"Pedido listo"

},


ENTREGADO:{

icon:"✅",

titulo:"Entregado"

}


};




const pasos=[

"PENDIENTE",

"LISTO_PARA_ENTREGA",

"ENTREGADO"

];



const posicion=pasos.indexOf(status);





return (

<div className="
bg-white
rounded-2xl
shadow
p-4
">


<h2 className="
text-base
font-black
mb-4
">

Seguimiento

</h2>





<div className="
space-y-4
">


{

pasos.map((paso,index)=>{


const activo=index<=posicion;


return (

<div

key={paso}

className="flex items-center gap-3"

>


<div className={`
w-9
h-9
rounded-full
flex
items-center
justify-center

${activo
?
"bg-orange-100"
:
"bg-gray-100"
}

`}>

{estados[paso].icon}

</div>



<div>

<p className={`
text-sm
font-bold

${activo
?
"text-gray-900"
:
"text-gray-400"
}

`}>

{estados[paso].titulo}

</p>


{

index===posicion &&

<p className="
text-xs
text-orange-600
font-bold
">

Estado actual

</p>

}


</div>


</div>

);


})


}


</div>


</div>


);


}