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

<div className="mb-6">


<div
className={`
bg-white
rounded-3xl
overflow-hidden
border
transition-all
duration-300

${
open
?
"border-orange-400 shadow-lg"
:
"border-gray-100 shadow-md"
}

`}
>


{/* IMAGEN CATEGORIA */}

<button

onClick={()=>setOpen(!open)}

className="w-full text-left"

>


<div className="
relative
h-32
overflow-hidden
">


<img

src={category.image}

alt={category.category}

className="
w-full
h-full
object-cover
"

/>


<div className="
absolute
bottom-0
left-0
right-0
bg-gradient-to-t
from-black/60
to-transparent
h-16
"/>


</div>





<div className="
px-5
py-4
flex
justify-between
items-center
">


<div>

<h2 className="
text-xl
font-extrabold
text-gray-900
">

{category.category}

</h2>


<p className="
text-sm
text-gray-500
">

{category.items.length} opciones

</p>


</div>



<div className="
w-9
h-9
rounded-full
bg-orange-100
flex
items-center
justify-center
text-orange-600
font-bold
">

{open ? "−":"+"}

</div>


</div>


</button>







{/* PRODUCTOS */}

{

open &&


<div className="
px-5
pb-5
">


{

category.items.map((item:any)=>(


<div

key={item.id}

className="
py-4
border-b
border-gray-100
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
text-sm
text-gray-500
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
rounded-2xl
p-3
"


>



<div className="
flex
items-center
justify-between
gap-3
">



<div>


<p className="
text-sm
font-bold
text-gray-800
">

{size.name}

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
px-4
py-2
rounded-full
text-sm
font-bold
shadow
active:scale-95
transition
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


}


</div>


</div>


);


}