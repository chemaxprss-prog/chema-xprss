"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


export default function ProductsPage(){


const [products,setProducts]=useState<any[]>([]);

const [filtered,setFiltered]=useState<any[]>([]);

const [search,setSearch]=useState("");

const [loading,setLoading]=useState(true);





useEffect(()=>{

loadProducts();

},[]);






useEffect(()=>{


if(!search.trim()){

setFiltered(products);

return;

}



const value=search.toLowerCase();



setFiltered(

products.filter((product)=>


product.name?.toLowerCase().includes(value)

||

product.categories?.name?.toLowerCase().includes(value)


)

);



},[search,products]);








async function loadProducts(){


const {data,error}=await supabase

.from("products")

.select(`

id,

name,

description,

image,

price_half,

price_liter,

price_single,

active,

categories(

name

)

`)

.order("id",{ascending:true});





if(error){

console.log(error);

return;

}



setProducts(data || []);

setFiltered(data || []);

setLoading(false);


}









async function toggleStatus(
id:number,
current:boolean
){



const {error}=await supabase

.from("products")

.update({

active:!current

})

.eq("id",id);





if(error){

console.log(error);

alert("Error actualizando estado");

return;

}



loadProducts();


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

Cargando productos...

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

🍤 Productos

</h1>


<p className="
text-gray-600
mt-2
">

Administración del menú CHEMA XPRSS

</p>


</div>





<Link

href="/admin/products/new"

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

+ Nuevo producto

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

placeholder="Buscar producto o categoría..."

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








<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
">





{

filtered.map((product)=>(


<div

key={product.id}

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

product.image &&


<img

src={product.image}

alt={product.name}

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

{product.name}

</h2>





<p className="
text-gray-500
mt-1
">

Categoría:

{" "}

{product.categories?.name || "Sin categoría"}

</p>








{

product.description &&


<p className="
mt-4
text-gray-700
"

>

{product.description}

</p>


}








<div className="
mt-5
bg-gray-50
rounded-2xl
p-4
space-y-2
">


<h3 className="
font-bold
text-gray-900
">

Precios

</h3>





{

product.price_half &&

<p>

🥤 1/2 Litro:

{" "}

<strong>

${product.price_half}

</strong>

</p>

}





{

product.price_liter &&

<p>

🥤 Litro:

{" "}

<strong>

${product.price_liter}

</strong>

</p>

}







{

product.price_single &&

<p>

🍽 Unidad:

{" "}

<strong>

${product.price_single}

</strong>

</p>

}



</div>









<div className="
mt-5
flex
items-center
justify-between
">


<span className={`
px-4
py-2
rounded-full
font-bold
text-sm

${

product.active

?

"bg-green-100 text-green-700"

:

"bg-red-100 text-red-700"

}

`}>

{

product.active

?

"🟢 Disponible"

:

"🔴 No disponible"

}

</span>





<button

onClick={()=>toggleStatus(
product.id,
product.active
)}

className="
font-bold
text-teal-700
"

>

{

product.active

?

"Desactivar"

:

"Activar"

}


</button>



</div>







<Link

href={`/admin/products/edit/${product.id}`}

className="
mt-6
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

Editar producto

</Link>







</div>


))


}



</div>





{

filtered.length===0 &&


<div className="
bg-white
rounded-3xl
shadow-md
p-6
text-center
text-gray-500
">

No se encontraron productos.

</div>


}



</div>


</main>


);


}