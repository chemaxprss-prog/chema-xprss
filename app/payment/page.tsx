"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { business } from "@/config/business";



export default function PaymentPage(){


const searchParams = useSearchParams();

const orderNumber = searchParams.get("order");



const [order,setOrder]=useState<any>(null);

const [file,setFile]=useState<File|null>(null);

const [loading,setLoading]=useState(false);

const [message,setMessage]=useState("");







useEffect(()=>{


async function loadOrder(){


if(!orderNumber) return;



const {data,error}=await supabase

.from("orders")

.select("*")

.eq("order_number",orderNumber)

.single();





if(error){

console.log(error);

return;

}



setOrder(data);



}



loadOrder();



},[orderNumber]);









async function uploadProof(){


if(!file || !order){

setMessage("Selecciona un comprobante");

return;

}



setLoading(true);

setMessage("");







const {data:existingPayment}=await supabase

.from("payments")

.select("id")

.eq("order_id",order.id)

.limit(1);






if(existingPayment && existingPayment.length>0){


setMessage(
"Ya existe un comprobante enviado para este pedido"
);


setLoading(false);

return;


}








const fileName =

`${order.order_number}-${Date.now()}-${file.name}`;






const {error:uploadError}=await supabase.storage

.from("payment-proofs")

.upload(
fileName,
file
);





if(uploadError){


console.log(uploadError);


setMessage(uploadError.message);


setLoading(false);


return;


}








const {data:urlData}=supabase.storage

.from("payment-proofs")

.getPublicUrl(fileName);









const {error:paymentError}=await supabase

.from("payments")

.insert({

order_id:order.id,

image:urlData.publicUrl,

status:"PENDIENTE_REVISION"

});







if(paymentError){


console.log(paymentError);


setMessage(paymentError.message);


setLoading(false);


return;


}








const {error:updateError}=await supabase

.from("orders")

.update({

payment_status:"PENDIENTE_REVISION"

})

.eq("id",order.id);







if(updateError){


console.log(updateError);


setMessage(updateError.message);


setLoading(false);


return;


}







setMessage(
"Comprobante enviado correctamente. Espera la confirmación del negocio."
);


setLoading(false);



}









if(!order){


return (

<main className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
">

<p className="text-gray-700">

Cargando pedido...

</p>


</main>

);


}









return (

<main className="
min-h-screen
bg-gray-100
p-5
">



<div className="
max-w-md
mx-auto
bg-white
rounded-3xl
shadow-xl
p-6
">







<h1 className="
text-3xl
font-extrabold
text-gray-900
text-center
">

Subir comprobante

</h1>









<div className="
mt-6
bg-teal-600
text-white
rounded-3xl
p-5
text-center
">


<p>

Pedido

</p>



<h2 className="
text-3xl
font-bold
">

{order.order_number}

</h2>





<p className="
mt-3
text-xl
font-bold
">

Total: ${order.total}

</p>



</div>









<div className="
mt-6
bg-orange-50
rounded-3xl
p-5
">


<h3 className="
text-xl
font-extrabold
text-teal-700
mb-4
">

Datos de transferencia

</h3>






<p className="text-gray-800">

🏦 Banco

<br/>

<strong>

{business.bank || "Banco no configurado"}

</strong>

</p>







<p className="
mt-3
text-gray-800
">

💳 Cuenta

<br/>

<strong>

{business.accountNumber || "Cuenta no configurada"}

</strong>

</p>







<p className="
mt-3
text-gray-800
">

👤 Titular

<br/>

<strong>

{business.accountHolder || "Titular no configurado"}

</strong>

</p>








{

business.qrImage &&


<img

src={business.qrImage}

alt="QR transferencia"

className="
mt-5
w-full
rounded-3xl
"

/>


}





</div>









<div className="mt-6">


<label className="
w-full
border
border-gray-300
rounded-2xl
p-4
flex
items-center
justify-center
cursor-pointer
text-gray-700
font-medium
hover:bg-gray-50
">


📎

{

file

?

file.name

:

"Seleccionar comprobante"

}






<input

type="file"

accept="image/*"

onChange={(e)=>
setFile(
e.target.files?.[0] || null
)
}

className="hidden"

/>



</label>


</div>









<button

onClick={uploadProof}

disabled={loading}

className="
mt-6
w-full
bg-orange-500
hover:bg-orange-600
text-white
py-4
rounded-full
font-bold
shadow-lg
"

>


{

loading

?

"Enviando..."

:

"Enviar comprobante"

}



</button>









{

message &&


<p className="
mt-5
text-center
font-semibold
text-gray-700
">

{message}

</p>


}







</div>


</main>


);


}