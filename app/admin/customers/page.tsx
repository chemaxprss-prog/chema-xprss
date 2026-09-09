"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function CustomersPage(){


const [customers,setCustomers]=useState<any[]>([]);

const [filtered,setFiltered]=useState<any[]>([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");





useEffect(()=>{

loadCustomers();

},[]);







useEffect(()=>{


if(!search.trim()){

setFiltered(customers);

return;

}



const value=search.toLowerCase();



setFiltered(

customers.filter((customer)=>


customer.name?.toLowerCase().includes(value)

||

customer.phone?.toLowerCase().includes(value)


)

);



},[search,customers]);









async function loadCustomers(){


const {data,error}=await supabase

.from("customers")

.select("*")

.order("created_at",{ascending:false});




if(error){

console.log(error);

alert(error.message);

return;

}



setCustomers(data || []);

setFiltered(data || []);

setLoading(false);


}








if(loading){


return (

<main className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
">

Cargando clientes...

</main>

);


}









return (

<main className="
min-h-screen
bg-gray-100
p-5
pb-10
">


<div className="
max-w-6xl
mx-auto
">





<h1 className="
text-4xl
font-extrabold
text-gray-900
">

👥 Clientes

</h1>



<p className="
text-gray-600
mt-2
mb-6
">

Gestión de clientes CHEMA XPRSS

</p>








<div className="
bg-white
rounded-3xl
shadow-md
p-5
mb-6
">


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Buscar por nombre o WhatsApp..."

className="
w-full
border
rounded-2xl
p-4
focus:outline-none
focus:border-orange-500
"

/>


</div>








{

filtered.length===0 &&


<div className="
bg-white
rounded-3xl
shadow-md
p-6
text-gray-500
">

No hay clientes registrados.

</div>


}









<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
">





{

filtered.map((customer)=>(


<div

key={customer.id}

className="
bg-white
rounded-3xl
shadow-md
p-6
border
border-gray-100
"

>



<div className="
flex
items-center
gap-3
mb-5
">


<div className="
w-14
h-14
rounded-full
bg-teal-100
flex
items-center
justify-center
text-2xl
">

👤

</div>



<h2 className="
text-xl
font-extrabold
text-teal-700
">

{customer.name}

</h2>



</div>








<div className="
bg-gray-50
rounded-2xl
p-4
space-y-3
text-gray-800
">


<p>

📱 <strong>WhatsApp:</strong>

<br/>

{customer.phone}

</p>





{

customer.address &&


<p>

📍 <strong>Dirección:</strong>

<br/>

{customer.address}

</p>


}






<p>

🛒 <strong>Pedidos:</strong>

{" "}

{customer.total_orders || 0}

</p>






<p>

💰 <strong>Total comprado:</strong>

{" "}

<span className="text-orange-600 font-bold">

${customer.total_spent || 0}

</span>

</p>





</div>








<div className="
mt-5
space-y-3
">





<a

href={`https://wa.me/${customer.phone}`}

target="_blank"

className="
block
text-center
bg-green-600
text-white
py-4
rounded-full
font-bold
hover:bg-green-700
transition
"

>

💬 WhatsApp

</a>







<a

href={`/admin/customers/${customer.id}`}

className="
block
text-center
bg-teal-600
text-white
py-4
rounded-full
font-bold
hover:bg-teal-700
transition
"

>

Ver historial

</a>







</div>





</div>


))


}





</div>






</div>


</main>


);


}