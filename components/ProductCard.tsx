"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";


interface Product {

id:number;

name:string;

description?:string;

image:string;

price_half:number | null;

price_liter:number | null;

price_single:number | null;

}



interface Props {

product:Product;

}



export default function ProductCard({product}:Props){


const {addItem}=useCart();


const [size,setSize]=useState("LITRO");



function getPrice(){


if(size==="MEDIO"){

return product.price_half;

}


if(size==="LITRO"){

return product.price_liter;

}


return product.price_single;


}



function addProduct(){


const price=getPrice();


if(!price){

return;

}


addItem({

id:product.id,

name:product.name,

size,

price,

quantity:1

});


}



return (

<div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">


<div className="h-48 bg-gray-100">


<img

src={product.image}

alt={product.name}

className="w-full h-full object-cover"

/>


</div>



<div className="p-5">


<h3 className="text-xl font-bold text-gray-900">

{product.name}

</h3>



{
product.description &&

<p className="text-gray-700 mt-2">

{product.description}

</p>

}



<div className="mt-4">


<h4 className="font-bold text-gray-900 mb-2">

Selecciona tamaño

</h4>



{
product.price_half &&

<button

onClick={()=>setSize("MEDIO")}

className={`w-full p-3 rounded-xl mb-2 font-bold ${
size==="MEDIO"
?
"bg-orange-500 text-white"
:
"bg-gray-100 text-gray-700"
}`}

>

1/2 Litro ${product.price_half}

</button>

}



{
product.price_liter &&

<button

onClick={()=>setSize("LITRO")}

className={`w-full p-3 rounded-xl mb-2 font-bold ${
size==="LITRO"
?
"bg-orange-500 text-white"
:
"bg-gray-100 text-gray-700"
}`}

>

Litro ${product.price_liter}

</button>

}



{
product.price_single &&

<button

onClick={()=>setSize("INDIVIDUAL")}

className={`w-full p-3 rounded-xl font-bold ${
size==="INDIVIDUAL"
?
"bg-orange-500 text-white"
:
"bg-gray-100 text-gray-700"
}`}

>

Individual ${product.price_single}

</button>

}


</div>




<div className="flex justify-between items-center mt-5">


<span className="font-bold text-xl text-orange-600">

${getPrice()}

</span>



<button

onClick={addProduct}

className="
bg-orange-500
hover:bg-orange-600
text-white
px-5
py-3
rounded-full
font-bold
transition
"

>

+ Agregar

</button>


</div>


</div>


</div>

);


}