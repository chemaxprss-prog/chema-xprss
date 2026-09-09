"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";


export default function CartPage(){


const {
items,
total,
increaseItem,
decreaseItem,
removeItem

}=useCart();


const router=useRouter();





return (

<main className="
min-h-screen
bg-gray-100
p-5
pb-10
">



<div className="
max-w-md
mx-auto
space-y-5
">



<h1 className="
text-4xl
font-extrabold
text-gray-900
">

🛒 Mi pedido

</h1>








{

items.length===0

?

<div className="
bg-white
rounded-3xl
shadow-md
p-8
text-center
">


<div className="
text-5xl
mb-4
">

🛒

</div>



<h2 className="
text-xl
font-extrabold
text-gray-900
">

Tu carrito está vacío

</h2>



<p className="
text-gray-600
mt-2
">

Agrega productos del menú para comenzar

</p>




<button

onClick={()=>router.push("/")}

className="
mt-5
w-full
bg-orange-500
text-white
py-4
rounded-full
font-bold
shadow-lg
"

>

Ver menú

</button>



</div>


:



<>


{

items.map((item,index)=>(


<div

key={index}

className="
bg-white
rounded-3xl
shadow-md
p-6
border
border-gray-100
"


>



<div className="
flex
justify-between
gap-3
">


<div>


<h2 className="
text-xl
font-extrabold
text-gray-900
">

{item.name}

</h2>



<div className="
inline-block
mt-2
bg-orange-50
text-orange-600
px-3
py-1
rounded-full
font-bold
text-sm
">

{item.size}

</div>



</div>





<p className="
text-xl
font-extrabold
text-orange-600
">

${item.price * item.quantity}

</p>



</div>







<div className="
mt-6
flex
justify-between
items-center
">


<div className="
flex
items-center
gap-4
bg-gray-100
rounded-full
p-2
">



<button

onClick={()=>decreaseItem(index)}

className="
w-10
h-10
rounded-full
bg-white
shadow
font-bold
text-xl
active:scale-95
"

>

-

</button>





<span className="
font-extrabold
text-gray-900
text-lg
">

{item.quantity}

</span>





<button

onClick={()=>increaseItem(index)}

className="
w-10
h-10
rounded-full
bg-orange-500
text-white
shadow
font-bold
text-xl
active:scale-95
"

>

+

</button>



</div>







<button

onClick={()=>removeItem(index)}

className="
text-red-500
font-bold
"

>

Eliminar

</button>



</div>





</div>



))

}





<div className="
bg-white
rounded-3xl
shadow-md
p-6
border
border-gray-100
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Resumen

</h2>




<div className="
flex
justify-between
text-2xl
font-extrabold
">


<span>

Total

</span>


<span className="
text-orange-600
">

${total}

</span>


</div>





<button

onClick={()=>router.push("/checkout")}

className="
mt-6
w-full
bg-orange-500
hover:bg-orange-600
text-white
py-5
rounded-full
font-extrabold
text-lg
shadow-lg
active:scale-95
transition
"

>

Continuar pedido

</button>





<button

onClick={()=>router.push("/")}

className="
mt-3
w-full
bg-white
border
border-gray-200
text-gray-700
py-4
rounded-full
font-bold
"

>

Seguir comprando

</button>



</div>



</>

}



</div>


</main>

);


}