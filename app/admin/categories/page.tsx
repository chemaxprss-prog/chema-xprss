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

category.name
?.toLowerCase()
.includes(value)

)

);


},[search,categories]);







async function loadCategories(){


const {

data,

error

}=await supabase

.from("categories")

.select("*")

.order(
"position",
{
ascending:true
}
);



if(error){

console.log(error);

return;

}



setCategories(data || []);

setFiltered(data || []);

setLoading(false);


}








async function moveCategory(

category:any,

direction:"up"|"down"

){


const index = categories.findIndex(

(item)=>item.id===category.id

);



if(
direction==="up"
&&
index===0
){

return;

}



if(
direction==="down"
&&
index===categories.length-1
){

return;

}



const targetIndex =

direction==="up"

?

index-1

:

index+1;



const target = categories[targetIndex];




await supabase

.from("categories")

.update({

position:target.position

})

.eq(
"id",
category.id
);





await supabase

.from("categories")

.update({

position:category.position

})

.eq(
"id",
target.id
);





loadCategories();


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

Orden del menú CHEMA XPRSS

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
"

>

+ Nueva categoría

</Link>


</div>






<div className="
bg-white
rounded-3xl
p-5
mb-6
shadow
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
"

 />

</div>






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
p-5
border
"

>





{

category.image &&

<img

src={category.image}

alt={category.name}

className="
w-full
h-44
object-cover
rounded-2xl
mb-4
"

/>

}







<div className="
flex
items-center
justify-between
mb-4
">


<div>


<h2 className="
text-xl
font-black
text-teal-700
">

{category.name}

</h2>


<p className="
text-sm
text-gray-500
">

Orden actual: {category.position}

</p>


</div>





<div className="
flex
gap-2
">


<button

onClick={()=>moveCategory(category,"up")}

className="
w-10
h-10
rounded-full
bg-gray-900
text-white
font-black
"

>

⬆

</button>




<button

onClick={()=>moveCategory(category,"down")}

className="
w-10
h-10
rounded-full
bg-gray-900
text-white
font-black
"

>

⬇

</button>



</div>


</div>








<div className="
bg-gray-50
rounded-2xl
p-4
mb-5
">


<p className="
font-bold
text-gray-700
">

📂 Orden del menú:

<span className="
text-orange-600
ml-2
">

#{category.position}

</span>


</p>


</div>







<Link

href={`/admin/categories/edit/${category.id}`}

className="
block
w-full
bg-orange-500
hover:bg-orange-600
text-white
text-center
py-3
rounded-full
font-bold
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