"use client";

import Link from "next/link";


interface NavbarProps {

business:any;

}



export default function Navbar({

business

}:NavbarProps){


return (

<nav

className="
fixed
top-0
left-0
right-0
z-50
bg-black/40
backdrop-blur-md
border-b
border-white/10
"

>



<div

className="
max-w-7xl
mx-auto
px-6
py-4
flex
items-center
justify-end
"

>





<div

className="
hidden
md:flex
items-center
gap-8
text-white
font-bold
"

>



<a

href="#inicio"

className="
hover:text-orange-400
transition
"

>

Inicio

</a>





<a

href="#menu"

className="
hover:text-orange-400
transition
"

>

Menú

</a>





<a

href="#contacto"

className="
hover:text-orange-400
transition
"

>

Contacto

</a>





<Link

href="/cart"

className="
bg-orange-500
hover:bg-orange-600
px-5
py-2
rounded-full
transition
"

>

🛒 Mi pedido

</Link>





</div>






</div>



</nav>


);


}