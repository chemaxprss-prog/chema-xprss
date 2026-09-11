"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function POSPage(){


const [categories,setCategories]=useState<any[]>([]);

const [products,setProducts]=useState<any[]>([]);

const [selectedCategory,setSelectedCategory]=useState<number | null>(null);


const [cart,setCart]=useState<any[]>([]);


const [search,setSearch]=useState("");


const [payment,setPayment]=useState("");


const [received,setReceived]=useState(0);


const [loading,setLoading]=useState(true);





useEffect(()=>{

loadData();

},[]);





async function loadData(){


await Promise.all([

loadCategories(),

loadProducts()

]);


setLoading(false);


}







async function loadCategories(){


const {data,error}=await supabase


.from("categories")


.select(`

id,

name,

image,

position

`)


.order(

"position"

);




if(error){

console.log(error);

return;

}



setCategories(data || []);



}









async function loadProducts(){


const {data,error}=await supabase


.from("products")


.select(`

id,

category_id,

name,

price_half,

price_liter,

price_single,

active

`)


.eq(

"active",

true

)


.order(

"position"

);





if(error){

console.log(error);

return;

}



setProducts(data || []);



}









function addProduct(

product:any,

size:string,

price:number

){



const exist = cart.find(

(item:any)=>

item.product_id===product.id &&

item.size===size

);




if(exist){



setCart(

cart.map(

(item:any)=>

item.product_id===product.id &&

item.size===size

?

{

...item,

quantity:item.quantity+1,

subtotal:

(item.quantity+1)

*

item.price

}

:

item


)

);



return;

}





setCart([

...cart,

{

product_id:product.id,

product_name:product.name,

size,

quantity:1,

price,

subtotal:price

}

]);



}









function updateQuantity(

index:number,

action:string

){



setCart(

cart

.map(

(item:any,i:number)=>{


if(i!==index)

return item;



let qty=item.quantity;



if(action==="add")

qty++;



if(action==="remove")

qty--;




if(qty<=0)

return null;




return {

...item,

quantity:qty,

subtotal:

qty *

item.price

};


}

)

.filter(Boolean)

);



}









function removeItem(index:number){


setCart(

cart.filter(

(_,i)=>

i!==index

)

);


}









function total(){


return cart.reduce(

(sum,item)=>

sum+

Number(item.subtotal),

0

);



}








function change(){


return Math.max(

received-total(),

0

);


}









const filteredProducts = products.filter(

(product:any)=>{


const categoryOK =

selectedCategory===null

?

true

:

product.category_id===selectedCategory;



const searchOK =

product.name

.toLowerCase()

.includes(

search.toLowerCase()

);



return categoryOK && searchOK;



}

);


async function finishSale(){


if(cart.length===0){

alert("Carrito vacío");

return;

}



if(!payment){

alert("Seleccione método de pago");

return;

}




const orderNumber =

"PED-"+Date.now();




const totalVenta = total();





// 1 CREAR ORDEN

const {

data:order,

error:orderError

}=await supabase


.from("orders")


.insert({

customer_name:"MOSTRADOR",

customer_phone:null,

delivery_type:"MOSTRADOR",

address:null,

notes:null,

total:totalVenta,

status:"ENTREGADO",

order_number:orderNumber,

payment_status:"PAGADO",

payment_method:payment

})


.select()


.single();





if(orderError){


console.log(orderError);


alert(

orderError.message

);


return;

}








// 2 CREAR DETALLE DE PRODUCTOS


const {

error:itemError

}=await supabase


.from("order_items")


.insert(


cart.map(

(item:any)=>(

{

order_id:order.id,

product_name:item.product_name,

quantity:item.quantity,

price:item.price,

notes:null,

size:item.size,

subtotal:item.subtotal

}


)

)

);





if(itemError){


console.log(itemError);


alert(

itemError.message

);


return;

}








// 3 CREAR PAGO



const {

error:paymentError

}=await supabase


.from("payments")


.insert({

order_id:order.id,

status:"PAGADO",

method:payment,

amount:totalVenta,

image:null,

confirmed_at:new Date()

});







if(paymentError){


console.log(paymentError);


alert(

paymentError.message

);


return;


}








alert(

`Venta realizada ${orderNumber}`

);





setCart([]);

setPayment("");

setReceived(0);



}
return (

<main className="
min-h-screen
bg-orange-50
p-3
">


<div className="
max-w-7xl
mx-auto
">


<h1 className="
text-3xl
font-black
mb-1
">

💰 Caja

</h1>


<p className="
text-gray-500
mb-4
">

Venta mostrador

</p>





<div className="
grid
grid-cols-1
xl:grid-cols-3
gap-4
">





{/* PRODUCTOS */}


<section className="
xl:col-span-2
bg-white
rounded-3xl
p-4
shadow
">



<h2 className="
font-black
text-xl
mb-3
">

Categorías

</h2>





<div className="
flex
gap-3
overflow-x-auto
pb-3
">


<button

onClick={()=>setSelectedCategory(null)}

className={`
min-w-[90px]
rounded-2xl
p-2
font-black
text-sm

${
selectedCategory===null

?

"bg-orange-500 text-white"

:

"bg-gray-100"

}

`}

>

Todos

</button>





{

categories.map((cat:any)=>(


<button

key={cat.id}

onClick={()=>setSelectedCategory(cat.id)}

className={`
min-w-[95px]
rounded-2xl
p-2
border

${
selectedCategory===cat.id

?

"bg-orange-500 text-white"

:

"bg-white"

}

`}

>


<div className="
w-14
h-14
mx-auto
rounded-xl
overflow-hidden
mb-1
">


<img

src={cat.image}

className="
w-full
h-full
object-cover
"

/>


</div>



<p className="
text-xs
font-black
truncate
">

{cat.name}

</p>



</button>


))


}



</div>






<input

placeholder="🔍 Buscar producto"

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

className="
w-full
border
rounded-2xl
p-3
mb-4
"

/>







<div className="
grid
grid-cols-2
md:grid-cols-3
gap-3
">


{

filteredProducts.map((product:any)=>(


<div

key={product.id}

className="
bg-gray-50
rounded-2xl
p-3
"


>


<h3 className="
font-black
mb-3
">

{product.name}

</h3>





<div className="
space-y-2
">



{

product.price_half &&

<button

onClick={()=>addProduct(

product,

"½ Litro",

product.price_half

)}

className="
w-full
bg-orange-500
text-white
rounded-xl
py-2
font-black
"

>

½ Litro ${product.price_half}

</button>

}





{

product.price_liter &&

<button

onClick={()=>addProduct(

product,

"Litro",

product.price_liter

)}

className="
w-full
bg-teal-600
text-white
rounded-xl
py-2
font-black
"

>

Litro ${product.price_liter}

</button>

}




{

product.price_single &&

<button

onClick={()=>addProduct(

product,

"Unidad",

product.price_single

)}

className="
w-full
bg-gray-900
text-white
rounded-xl
py-2
font-black
"

>

Unidad ${product.price_single}

</button>

}



</div>



</div>



))


}



</div>



</section>








{/* CARRITO */}


<section className="
bg-white
rounded-3xl
p-4
shadow
h-fit
">



<h2 className="
font-black
text-xl
mb-4
">

🛒 Ticket

</h2>





<div className="
space-y-3
max-h-96
overflow-y-auto
">


{

cart.map((item:any,index:number)=>(


<div

key={index}

className="
bg-gray-100
rounded-xl
p-3
flex
justify-between
"


>


<div>


<p className="
font-black
">

{item.product_name}

</p>


<p className="
text-sm
text-gray-500
">

{item.size}

</p>



<div className="
flex
gap-2
items-center
mt-2
">


<button

onClick={()=>updateQuantity(index,"remove")}

className="
bg-red-500
text-white
w-8
h-8
rounded-full
font-black
"

>

-

</button>



<span className="
font-black
">

{item.quantity}

</span>



<button

onClick={()=>updateQuantity(index,"add")}

className="
bg-green-600
text-white
w-8
h-8
rounded-full
font-black
"

>

+

</button>



</div>



</div>




<div>


<p className="
font-black
">

${item.subtotal}

</p>



<button

onClick={()=>removeItem(index)}

className="
text-red-500
text-xs
font-bold
"

>

Eliminar

</button>



</div>



</div>


))


}


</div>







<hr className="
my-4
"/>





<p className="
text-3xl
font-black
">

TOTAL ${total()}

</p>






<input

type="number"

placeholder="💵 Recibido"

value={received}

onChange={(e)=>

setReceived(

Number(e.target.value)

)

}

className="
w-full
border
rounded-xl
p-3
mt-3
"

/>





<p className="
font-black
text-xl
mt-3
">

Cambio ${change()}

</p>







<select

value={payment}

onChange={(e)=>
setPayment(e.target.value)
}

className="
w-full
border
rounded-xl
p-3
mt-3
"

>


<option value="">

Método pago

</option>


<option value="EFECTIVO">

💵 Efectivo

</option>


<option value="TRANSFERENCIA">

📲 Transferencia

</option>


<option value="TARJETA">

💳 Tarjeta

</option>


</select>






<button

onClick={finishSale}

className="
w-full
bg-green-600
text-white
rounded-2xl
py-4
mt-4
font-black
text-lg
"

>

COBRAR

</button>





</section>




</div>


</div>


</main>


);


}