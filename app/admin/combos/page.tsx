"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


export default function CombosPage(){


const [combos,setCombos]=useState<any[]>([]);

const [loading,setLoading]=useState(true);





useEffect(()=>{

loadCombos();

},[]);






async function loadCombos(){


const {data,error}=await supabase

.from("combos")

.select("*")

.order("id",{ascending:true});





if(error){

console.log(error);

return;

}



setCombos(data || []);

setLoading(false);


}







async function toggleStatus(
id:number,
current:boolean
){


const {error}=await supabase

.from("combos")

.update({

active:!current

})

.eq("id",id);





if(error){

alert("Error actualizando combo");

console.log(error);

return;

}



loadCombos();


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

Cargando combos...

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
max-w-6xl
mx-auto
">





<div className="
flex
justify-between
items-center
mb-6
">



<div>

<h1 className="
text-4xl
font-extrabold
text-gray-900
">

🔥 Combos

</h1>


<p className="
text-gray-600
mt-2
">

Administración de combos CHEMA XPRSS

</p>


</div>






<Link

href="/admin/combos/new"

className="
bg-teal-600
hover:bg-teal-700
text-white
px-6
py-4
rounded-full
font-bold
"

>

+ Nuevo combo

</Link>



</div>









<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
">





{

combos.map(combo=>(


<div

key={combo.id}

className="
bg-white
rounded-3xl
shadow-md
p-6
"

>



{

combo.image &&

<img

src={combo.image}

className="
w-full
h-48
object-cover
rounded-2xl
mb-5
"

/>


}





<h2 className="
text-2xl
font-extrabold
text-teal-700
">

{combo.name}

</h2>





<p className="
text-gray-600
mt-3
">

{combo.description}

</p>







<div className="
mt-5
bg-gray-50
rounded-2xl
p-4
font-bold
text-xl
">

💰 ${combo.price}

</div>









<div className="
mt-5
flex
justify-between
items-center
">



<span className={`
px-4
py-2
rounded-full
font-bold

${

combo.active

?

"bg-green-100 text-green-700"

:

"bg-red-100 text-red-700"

}

`}>

{

combo.active

?

"🟢 Activo"

:

"🔴 Oculto"

}


</span>






<button

onClick={()=>toggleStatus(
combo.id,
combo.active
)}

className="
text-teal-700
font-bold
"

>

{

combo.active

?

"Desactivar"

:

"Activar"

}


</button>



</div>






<Link

href={`/admin/combos/edit/${combo.id}`}

className="
block
mt-5
bg-orange-500
text-white
text-center
py-4
rounded-full
font-bold
"

>

Editar combo

</Link>





</div>


))


}



</div>






</div>


</main>


);


}