"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function CheckoutPage(){


const {items,total}=useCart();

const router=useRouter();


const [name,setName]=useState("");
const [phone,setPhone]=useState("");

const [delivery,setDelivery]=useState("Recoger");

const [paymentMethod,setPaymentMethod]=useState("EFECTIVO");

const [address,setAddress]=useState("");

const [notes,setNotes]=useState("");

const [loading,setLoading]=useState(false);

const [error,setError]=useState("");




async function confirmOrder(){


if(!name.trim() || !phone.trim()){

setError("Completa nombre y WhatsApp");

return;

}



if(delivery==="Domicilio" && !address.trim()){

setError("Completa la dirección");

return;

}



if(items.length===0){

setError("El carrito está vacío");

return;

}



setLoading(true);

setError("");





const orderItems = items.map(item=>({

product_id:item.id,

size:item.size,

quantity:item.quantity,

notes:item.notes || ""

}));





console.log(
"ITEMS ORIGINALES CART:",
JSON.stringify(items,null,2)
);



console.log(
"ITEMS ENVIADOS RPC:",
JSON.stringify(orderItems,null,2)
);







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

console.log(error);

setError(error.message);

setLoading(false);

return;

}







console.log(
"RESPUESTA PEDIDO:",
data
);





router.push(

`/confirmation?order=${data.order_number}`

);



}









return (

<main className="
min-h-screen
bg-gray-100
p-5
pb-10
">


<h1 className="
text-4xl
font-extrabold
text-gray-900
mb-6
">

🛒 Finalizar pedido

</h1>





<div className="space-y-5">







<div className="
bg-white
rounded-3xl
shadow-md
p-6
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Datos del cliente

</h2>



<input

placeholder="Nombre completo"

value={name}

onChange={(e)=>setName(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
mb-3
"

/>



<input

placeholder="WhatsApp"

value={phone}

onChange={(e)=>setPhone(e.target.value)}

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
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Tipo de entrega

</h2>





<button

onClick={()=>setDelivery("Recoger")}

className={`
w-full
text-left
p-5
rounded-2xl
border-2
mb-3
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

onClick={()=>setDelivery("Domicilio")}

className={`
w-full
text-left
p-5
rounded-2xl
border-2
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

placeholder="Dirección"

value={address}

onChange={(e)=>setAddress(e.target.value)}

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
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Forma de pago

</h2>





<button

onClick={()=>setPaymentMethod("EFECTIVO")}

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

onClick={()=>setPaymentMethod("TRANSFERENCIA")}

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



</div>









<div className="
bg-white
rounded-3xl
shadow-md
p-6
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Notas

</h2>




<textarea

value={notes}

onChange={(e)=>setNotes(e.target.value)}

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

<p className="
text-red-500
font-bold
mb-4
">

{error}

</p>

}







<button

onClick={confirmOrder}

disabled={loading}

className="
w-full
bg-orange-500
hover:bg-orange-600
text-white
py-5
rounded-full
font-extrabold
text-lg
"

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