import { supabase } from "@/lib/supabase";
import OrderTracker from "./OrderTracker";


export default async function PedidoPage({

params

}:{

params:Promise<{
order:string
}>

}){


const {order}=await params;



const {data:pedido,error}=await supabase

.from("orders")

.select(`
*,
order_items(
id,
product_name,
quantity,
size,
subtotal
)
`)

.eq(
"order_number",
order
)

.single();





if(error || !pedido){

return (

<main className="min-h-screen bg-gray-100 p-5">

<div className="max-w-md mx-auto bg-white rounded-3xl p-5">

<h1 className="text-xl font-black text-red-600">

Pedido no encontrado

</h1>

<p className="mt-3">

{order}

</p>

</div>

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
space-y-3
">



<h1 className="
text-2xl
font-black
text-center
">

🍤 CHEMA XPRSS

</h1>





<div className="
bg-white
rounded-2xl
shadow
p-4
">


<p className="
text-xs
text-gray-500
font-bold
">

PEDIDO

</p>


<h2 className="
text-xl
font-black
text-orange-500
">

#{pedido.order_number}

</h2>


</div>





<OrderTracker

orderId={pedido.id}

initialStatus={pedido.status}

/>







<div className="
bg-white
rounded-2xl
shadow
p-4
">


<h2 className="
font-black
mb-3
">

Detalle del pedido

</h2>



{

pedido.order_items?.map((item:any)=>(


<div

key={item.id}

className="
flex
justify-between
border-b
py-3
text-sm
"

>


<div>

<p className="font-bold">

{item.product_name}

</p>


{

item.size &&

<p className="text-gray-500 text-xs">

{item.size}

</p>

}

</div>



<div>

x{item.quantity}

</div>


</div>


))


}





<div className="
flex
justify-between
font-black
text-lg
mt-4
">

<span>

Total

</span>


<span className="text-orange-500">

${pedido.total}

</span>


</div>



</div>








<div className="
bg-white
rounded-2xl
shadow
p-4
">


<h2 className="
font-black
mb-2
">

Entrega

</h2>


<p className="text-sm">

{pedido.delivery_type}

</p>



{

pedido.address &&

<p className="text-sm text-gray-500">

{pedido.address}

</p>

}



</div>





</div>

</main>

);


}