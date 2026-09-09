"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Props {
  category:any;
}


export default function MenuAccordion({category}:Props){


const [open,setOpen]=useState(false);

const {addItem}=useCart();



return (

<div className="mb-5">


<div
className={`
bg-white
rounded-2xl
overflow-hidden
border
transition-all

${
open
?
"border-orange-500 shadow-lg"
:
"border-gray-100 shadow"
}

`}
>


<button

onClick={()=>setOpen(!open)}

className="w-full text-left"

>


<div className="h-36 bg-white overflow-hidden">

<img

src={category.image}

alt={category.category}

className="
w-full
h-full
object-contain
"

/>

</div>



<div className="
p-3
flex
items-center
justify-between
">


<span className="
text-lg
font-extrabold
text-blue-600
uppercase
">

{
open
?
"Ocultar productos"
:
category.category
}

</span>


<span className="
text-xl
text-orange-500
font-bold
">

⌄

</span>


</div>


</button>







<div

className={`
overflow-hidden
transition-all

${
open
?
"max-h-[3000px] p-4"
:
"max-h-0 p-0"
}

`}

>



{
category.items.map((item:any)=>(


<div

key={item.id}

className="
border-b
py-4
last:border-none
"

>


<h3 className="
text-base
font-bold
text-gray-900
">

{item.name}

</h3>




{
item.description &&

<p className="
text-xs
text-gray-600
mt-1
">

{item.description}

</p>

}





{

item.sizes.map((size:any)=>(


<div

key={size.name}

className="
mt-3
bg-orange-50
rounded-xl
p-3
"

>


<div className="
flex
justify-between
items-center
">


<div>


<p className="
text-sm
font-bold
text-gray-800
">

{size.name === "1/2 Litro" ? "Medio litro" : size.name}

</p>


<p className="
text-lg
font-extrabold
text-orange-600
">

${size.price}

</p>


</div>



<button

onClick={()=>addItem({

id:item.id,

name:item.name,

size:size.name,

price:size.price,

quantity:1

})}


className="
bg-orange-500
hover:bg-orange-600
text-white
px-5
py-2
rounded-full
text-sm
font-bold
"

>

+ Agregar

</button>


</div>



</div>


))

}



</div>


))


}



</div>



</div>


</div>


);


}