"use client";


interface BusinessInfoProps {

business:any;

}



export default function BusinessInfo({

business

}:BusinessInfoProps){



return (


<section

id="contacto"

className="
bg-black
py-8
px-6
"

>


<div

className="
max-w-5xl
mx-auto
grid
grid-cols-1
md:grid-cols-2
gap-4
"

>





<div

className="
bg-white/10
border
border-white/10
rounded-2xl
p-5
text-white
flex
items-center
gap-4
hover:border-orange-400
transition
"

>



<div

className="
text-3xl
"

>

📍

</div>




<div>


<h3

className="
font-black
text-cyan-300
text-lg
"

>

Ubicación

</h3>




<p

className="
text-gray-300
text-sm
"

>

{

business?.address ||

"Consulta nuestra ubicación"

}

</p>





{

business?.maps_url &&


<a

href={business.maps_url}

target="_blank"

className="
text-orange-400
text-sm
font-bold
"

>

Ver en Google Maps →

</a>

}



</div>



</div>










<div

className="
bg-white/10
border
border-white/10
rounded-2xl
p-5
text-white
flex
items-center
gap-4
hover:border-orange-400
transition
"

>




<div

className="
text-3xl
"

>

🕒

</div>




<div>


<h3

className="
font-black
text-cyan-300
text-lg
"

>

Horarios

</h3>





<p

className="
text-gray-300
text-sm
whitespace-pre-line
"

>

{

business?.opening_hours ||

"Horario no disponible"

}

</p>




</div>




</div>







</div>


</section>


);


}