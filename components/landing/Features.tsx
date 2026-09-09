"use client";


const features=[

{
icon:"🐟",
title:"Ingredientes frescos",
text:"Seleccionamos productos de calidad para ofrecer el mejor sabor del mar."
},


{
icon:"🔥",
title:"Sabor auténtico",
text:"Preparaciones hechas al momento con recetas llenas de sabor."
},


{
icon:"⚡",
title:"Pedido rápido",
text:"Ordena online de forma sencilla y recibe tu pedido sin complicaciones."
}

];





export default function Features(){



return (


<section

className="
bg-black
py-20
px-6
"

>



<div

className="
max-w-6xl
mx-auto
"

>




<h2

className="
text-4xl
md:text-5xl
font-black
text-center
text-white
mb-12
"

>

¿Por qué elegir CHEMA XPRSS?

</h2>







<div

className="
grid
md:grid-cols-3
gap-6
"

>



{

features.map((item)=>(


<div

key={item.title}

className="
bg-white/10
backdrop-blur-md
border
border-white/10
rounded-3xl
p-8
text-center
hover:-translate-y-2
transition
"

>



<div

className="
text-6xl
mb-5
"

>

{item.icon}

</div>





<h3

className="
text-2xl
font-black
text-cyan-300
mb-4
"

>

{item.title}

</h3>





<p

className="
text-gray-200
leading-relaxed
"

>

{item.text}

</p>





</div>


))


}



</div>





</div>


</section>


);


}