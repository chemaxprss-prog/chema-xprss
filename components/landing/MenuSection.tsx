"use client";

import { useRouter } from "next/navigation";


interface MenuSectionProps {

menu:any[];

}



export default function MenuSection({

menu

}:MenuSectionProps){



const router = useRouter();





return (

<section

id="menu"

className="
bg-gray-100
py-20
px-6
"

>



<div

className="
max-w-7xl
mx-auto
"

>




<h2

className="
text-4xl
md:text-5xl
font-black
text-center
text-gray-900
mb-4
"

>

Nuestro Menú

</h2>





<p

className="
text-center
text-gray-600
text-lg
mb-12
"

>

Descubre nuestros sabores y especialidades

</p>









<div

className="
grid
grid-cols-2
md:grid-cols-4
gap-5
"

>





{

menu.slice(0,4).map((category:any)=>(


<div

key={category.category}

className="
bg-white
rounded-3xl
overflow-hidden
shadow-md
hover:shadow-xl
transition
hover:-translate-y-2
"

>




{

category.image &&


<img

src={category.image}

alt={category.category}

className="
w-full
h-40
object-cover
"

/>

}




<div

className="
p-4
"

>


<h3

className="
text-xl
font-black
text-teal-700
"

>

{category.category}

</h3>



<p

className="
text-gray-500
mt-2
"

>

Ver opciones →

</p>



</div>





</div>


))


}




</div>









<div

className="
text-center
mt-12
"

>


<button

onClick={()=>router.push("/menu")}

className="
bg-orange-500
hover:bg-orange-600
text-white
font-black
px-10
py-4
rounded-full
shadow-lg
transition
hover:scale-105
"

>

🍤 VER MENÚ COMPLETO

</button>



</div>






</div>


</section>


);


}