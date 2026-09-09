"use client";

import { FaWhatsapp } from "react-icons/fa";


interface WhatsAppButtonProps {

business:any;

}



export default function WhatsAppButton({

business

}:WhatsAppButtonProps){



const whatsappUrl = business?.whatsapp

?

`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
"Hola, tengo una consulta sobre CHEMA XPRSS 🍤"
)}`

:

"#";





return (


<a

href={whatsappUrl}

target="_blank"

aria-label="WhatsApp"

className="
fixed
bottom-6
right-6
z-50
w-14
h-14
rounded-full
bg-green-500
flex
items-center
justify-center
shadow-xl
hover:scale-110
transition-transform
"

>


<FaWhatsapp

className="
text-white
text-4xl
"

/>



</a>


);


}