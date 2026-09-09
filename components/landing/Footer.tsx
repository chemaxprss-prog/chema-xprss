"use client";


interface FooterProps {

business:any;

}




export default function Footer({
business
}:FooterProps){



const whatsappUrl = business?.whatsapp

?

`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
"Hola, quiero hacer un pedido en CHEMA XPRSS 🍤"
)}`

:

"#";





return (


<footer

className="
bg-black
border-t
border-white/10
text-white
py-14
px-6
"

>



<div

className="
max-w-6xl
mx-auto
"

>




<div

className="
grid
md:grid-cols-3
gap-10
"

>







<div>


{

business?.logo &&


<img

src={business.logo}

alt="Logo"

className="
w-36
mb-5
object-contain
"

/>

}




<h3

className="
text-2xl
font-black
mb-3
"

>

{

business?.business_name ||

"CHEMA XPRSS"

}

</h3>




<p

className="
text-gray-300
"

>

{

business?.slogan ||

"El sabor del mar a un solo clic"

}

</p>



</div>









<div>


<h4

className="
text-xl
font-black
text-cyan-300
mb-5
"

>

Contacto

</h4>



<p className="
text-gray-300
mb-3
">

📍 {business?.address || "Ubicación"}

</p>



<p className="
text-gray-300
mb-3
">

🕒 {business?.opening_hours || "Horario"}

</p>





<a

href={whatsappUrl}

target="_blank"

className="
inline-block
bg-orange-500
hover:bg-orange-600
px-5
py-3
rounded-full
font-black
"

>

📱 WhatsApp

</a>




</div>









<div>


<h4

className="
text-xl
font-black
text-cyan-300
mb-5
"

>

Síguenos

</h4>




<div className="
space-y-3
"

>





{

business?.facebook &&

<a

href={business.facebook}

target="_blank"

className="
block
text-gray-300
hover:text-orange-400
"

>

Facebook

</a>

}





{

business?.instagram &&

<a

href={business.instagram}

target="_blank"

className="
block
text-gray-300
hover:text-orange-400
"

>

Instagram

</a>

}







{

business?.tiktok &&

<a

href={business.tiktok}

target="_blank"

className="
block
text-gray-300
hover:text-orange-400
"

>

TikTok

</a>

}




</div>



</div>






</div>








<div

className="
border-t
border-white/10
mt-10
pt-6
text-center
text-gray-400
"

>


© {new Date().getFullYear()} {business?.business_name || "CHEMA XPRSS"}

</div>






</div>



</footer>


);



}