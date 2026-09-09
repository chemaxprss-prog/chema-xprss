"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


export default function CategoriesPage(){


const [categories,setCategories]=useState<any[]>([]);

const [filtered,setFiltered]=useState<any[]>([]);

const [search,setSearch]=useState("");

const [loading,setLoading]=useState(true);






useEffect(()=>{

loadCategories();

},[]);








useEffect(()=>{


if(!search.trim()){

setFiltered(categories);

return;

}



const value=search.toLowerCase();



setFiltered(

categories.filter((category)=>

category.name?.toLowerCase().includes(value)

)

);



},[search,categories]);









async function loadCategories(){


const {data,error}=await supabase

.from("categories")

.select("*")

.order("position",{ascending:true});





if(error){

console.log(error);

return;

}



setCategories(data || []);

setFiltered(data || []);

setLoading(false);



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

Cargando categorías...

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
flex-col
md:flex-row
justify-between
gap-4
mb-6
">



<div>


<h1 className="
text-4xl
font-extrabold
text-gray-900
">

📂 Categorías

</h1>



<p className="
text-gray-600
mt-2
">

Organización del menú CHEMA XPRSS

</p>


</div>







<Link

href="/admin/categories/new"

className="
bg-teal-600
hover:bg-teal-700
text-white
px-6
py-4
rounded-full
font-bold
text-center
shadow-md
"

>

+ Nueva categoría

</Link>



</div>









<div className="
bg-white
rounded-3xl
shadow-md
p-5
mb-6
">


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Buscar categoría..."

className="
w-full
border
rounded-2xl
p-4
focus:outline-none
focus:border-orange-500
"

/>



</div>









{

filtered.length===0 &&


<div className="
bg-white
rounded-3xl
shadow-md
p-6
text-gray-500
">

No hay categorías registradas.

</div>


}








<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
">







{

filtered.map((category)=>(


<div

key={category.id}

className="
bg-white
rounded-3xl
shadow-md
p-6
border
border-gray-100
"

>







{

category.image &&


<img

src={category.image}

alt={category.name}

className="
w-full
h-48
object-cover
rounded-3xl
mb-5
"

/>


}








<div className="
flex
items-center
justify-between
mb-4
">


<h2 className="
text-2xl
font-extrabold
text-teal-700
">

{category.name}

</h2>



<span className="
bg-orange-100
text-orange-700
px-3
py-1
rounded-full
font-bold
text-sm
">

#{category.position}

</span>



</div>









<div className="
bg-gray-50
rounded-2xl
p-4
">


<p className="
text-gray-700
">

📂 Orden del menú:

{" "}

<strong>

{category.position}

</strong>

</p>



</div>








<Link

href={`/admin/categories/edit/${category.id}`}

className="
mt-5
block
w-full
bg-orange-500
hover:bg-orange-600
text-white
py-4
rounded-full
font-bold
text-center
shadow-md
"

>

Editar categoría

</Link>








</div>


))


}





</div>







</div>


</main>


);


}