"use client";

import { useRouter } from "next/navigation";


interface HeroProps {

business:any;

}



export default function Hero({

business

}:HeroProps){



const router = useRouter();





return (


<section

id="inicio"

className="
relative
min-h-[560px]
md:min-h-[720px]
overflow-hidden
bg-black
flex
items-end
"

>





<picture>



{

business?.hero_mobile &&


<source

media="(max-width:768px)"

srcSet={business.hero_mobile}

/>

}





<img

src={
business?.hero_image ||
"/images/default-hero.jpg"
}

alt="CHEMA XPRSS"

className="
absolute
inset-0
w-full
h-full
object-cover
object-center
"

/>



</picture>







<div

className="
absolute
inset-0
bg-gradient-to-t
from-black/70
via-transparent
to-black/20
"

/>







<div

className="
relative
z-10
w-full
max-w-7xl
mx-auto
px-6
pb-12
"

>




<button

onClick={()=>router.push("/menu")}

className="
bg-orange-500
hover:bg-orange-600
text-white
font-black
text-lg
px-8
py-4
rounded-full
shadow-[0_0_30px_rgba(249,115,22,0.8)]
transition
hover:scale-105
"

>

🍤 ORDENAR AQUÍ

</button>





</div>







</section>


);


}