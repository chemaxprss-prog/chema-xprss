"use client";


import { useEffect, useState } from "react";

import { useCart } from "@/context/CartContext";

import { supabase } from "@/lib/supabase";

import { getBusiness } from "@/lib/business";



export default function CheckoutPage() {


const { items, total } = useCart();



const [business,setBusiness]=useState<any>(null);



const [name,setName]=useState("");

const [phone,setPhone]=useState("");

const [delivery,setDelivery]=useState("Recoger");

const [paymentMethod,setPaymentMethod]=useState("EFECTIVO");

const [address,setAddress]=useState("");

const [notes,setNotes]=useState("");

const [loading,setLoading]=useState(false);

const [error,setError]=useState("");






useEffect(()=>{


getBusiness()

.then((data)=>{

setBusiness(data);

});


},[]);








async function confirmOrder(){



if(!name.trim() || !phone.trim()){


setError(
"Completa nombre y WhatsApp"
);


return;


}





if(
delivery==="Domicilio"
&&
!address.trim()
){


setError(
"Completa la dirección"
);


return;


}






if(items.length===0){


setError(
"El carrito está vacío"
);


return;


}





setLoading(true);

setError("");





try{



const orderItems = items.map((item:any)=>(


{

product_id:item.id,

size:item.size,

quantity:item.quantity,

notes:item.notes || ""


}


));








const {data,error}=await supabase.rpc(

"create_order",

{


p_customer_name:name,

p_customer_phone:phone,

p_delivery_type:delivery,

p_address:address,

p_notes:notes,

p_payment_method:paymentMethod,

p_items:orderItems


}

);








if(error){


console.log(
"ERROR CREANDO PEDIDO:",
error
);


setError(error.message);


setLoading(false);


return;


}







const orderNumber=data?.order_number;





if(!orderNumber){


setError(
"Pedido creado pero sin número de confirmación"
);


setLoading(false);


return;


}






try{


localStorage.removeItem("cart");


}catch(e){


console.log(e);


}







window.location.href =

`/confirmation?order=${encodeURIComponent(orderNumber)}`;



}catch(err:any){



console.log(err);


setError(
err.message || "Error creando pedido"
);



setLoading(false);



}



}






return (

<main className="
min-h-screen
bg-gray-100
p-5
pb-10
">


<div className="
max-w-3xl
mx-auto
">


<h1 className="
text-4xl
font-extrabold
text-gray-900
mb-6
">

🛒 Finalizar pedido

</h1>
<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Datos del cliente

</h2>


<div className="
bg-white
rounded-3xl
shadow-md
p-6
space-y-3
">


<input

type="text"

placeholder="Nombre completo"

value={name}

onChange={(e)=>
setName(e.target.value)
}

disabled={loading}

className="
w-full
border
rounded-2xl
p-4
"

/>



<input

type="tel"

placeholder="WhatsApp"

value={phone}

onChange={(e)=>
setPhone(e.target.value)
}

disabled={loading}

className="
w-full
border
rounded-2xl
p-4
"

/>


</div>







<div className="
bg-white
rounded-3xl
shadow-md
p-6
mt-5
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

🚚 Tipo de entrega

</h2>




<button

type="button"

onClick={()=>
setDelivery("Recoger")
}

disabled={loading}

className={`
w-full
p-5
rounded-2xl
border-2
mb-3
text-left

${
delivery==="Recoger"

?

"border-orange-500 bg-orange-50"

:

"border-gray-200"

}

`}

>

🚶 Recoger en negocio

</button>






<button

type="button"

onClick={()=>
setDelivery("Domicilio")
}

disabled={loading}

className={`
w-full
p-5
rounded-2xl
border-2
text-left

${
delivery==="Domicilio"

?

"border-orange-500 bg-orange-50"

:

"border-gray-200"

}

`}

>

🛵 Envío a domicilio

</button>







{

delivery==="Domicilio" &&

<input

type="text"

placeholder="Dirección"

value={address}

onChange={(e)=>
setAddress(e.target.value)
}

disabled={loading}

className="
mt-4
w-full
border
rounded-2xl
p-4
"

/>

}



</div>







<div className="
bg-white
rounded-3xl
shadow-md
p-6
mt-5
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

💳 Forma de pago

</h2>







<button

type="button"

onClick={()=>
setPaymentMethod("EFECTIVO")
}

disabled={loading}

className={`
w-full
p-5
rounded-2xl
border-2
mb-3
text-left

${
paymentMethod==="EFECTIVO"

?

"border-orange-500 bg-orange-50"

:

"border-gray-200"

}

`}

>

💵 Efectivo

</button>







<button

type="button"

onClick={()=>
setPaymentMethod("TRANSFERENCIA")
}

disabled={loading}

className={`
w-full
p-5
rounded-2xl
border-2
text-left

${
paymentMethod==="TRANSFERENCIA"

?

"border-orange-500 bg-orange-50"

:

"border-gray-200"

}

`}

>

🏦 Transferencia

</button>








{

paymentMethod==="TRANSFERENCIA"

&&

business

&&

(

<div className="
mt-5
bg-teal-50
border
border-teal-200
rounded-2xl
p-5
">


<h3 className="
font-black
text-teal-700
text-lg
mb-3
">

📲 Datos para transferencia

</h3>




<p>

<b>Banco:</b>{" "}

{business.bank_name}

</p>



<p>

<b>Titular:</b>{" "}

{business.account_holder}

</p>



<p>

<b>Cuenta:</b>{" "}

{business.bank_account}

</p>



<p>

<b>CLABE:</b>{" "}

{business.bank_clabe}

</p>





<p className="
mt-4
text-sm
text-gray-600
">

Después de realizar tu pago envía comprobante por WhatsApp.

</p>






{

business.whatsapp &&

<a

href={

`https://wa.me/${business.whatsapp.replace(/\D/g,"")}`

}

target="_blank"

className="
block
mt-4
bg-green-600
text-white
text-center
rounded-xl
py-3
font-black
"

>

📲 Enviar comprobante

</a>

}



</div>

)

}



</div>







<div className="
bg-white
rounded-3xl
shadow-md
p-6
mt-5
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

📝 Notas

</h2>





<textarea

placeholder="Alguna indicación para tu pedido..."

value={notes}

onChange={(e)=>
setNotes(e.target.value)
}

disabled={loading}

className="
w-full
border
rounded-2xl
p-4
h-28
"

/>



</div>







<div className="
bg-white
rounded-3xl
shadow-md
p-6
mt-5
">


<div className="
flex
justify-between
text-2xl
font-extrabold
mb-5
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






{

error &&

<div className="
bg-red-50
border
border-red-200
text-red-600
rounded-2xl
p-4
font-bold
mb-4
">

{error}

</div>

}







<button

type="button"

onClick={confirmOrder}

disabled={loading}

className={`
w-full
py-5
rounded-full
font-extrabold
text-lg
text-white

${
loading

?

"bg-gray-400"

:

"bg-orange-500 hover:bg-orange-600"

}

`}

>

{

loading

?

"Procesando..."

:

"Confirmar pedido"

}

</button>




</div>




</div>


</main>


);


}