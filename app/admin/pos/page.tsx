"use client";

import {
  useEffect,
  useState
} from "react";

import {
  supabase
} from "@/lib/supabase";



export default function POSPage(){



const [
  products,
  setProducts
]=useState<any[]>([]);



const [
  cart,
  setCart
]=useState<any[]>([]);



const [
  search,
  setSearch
]=useState("");



const [
  payment,
  setPayment
]=useState("");



const [
  received,
  setReceived
]=useState(0);



const [
  loading,
  setLoading
]=useState(true);






useEffect(()=>{

  loadProducts();

},[]);







async function loadProducts(){


  const {
    data,
    error

  } = await supabase


  .from("products")


  .select(`

    id,

    name,

    price_half,

    price_liter,

    price_single

  `)


  .eq(
    "active",
    true
  )


  .order(
    "name"
  );




  if(error){

    console.log(error);

    return;

  }




  setProducts(
    data || []
  );


  setLoading(false);


}









function addProduct(

  product:any,

  size:string,

  price:number

){



  const existing = cart.find(

    (item:any)=>

      item.product_id === product.id &&

      item.size === size

  );





  if(existing){



    setCart(

      cart.map(

        (item:any)=>

        item.product_id === product.id &&

        item.size === size

        ?

        {

          ...item,

          quantity:item.quantity + 1,

          subtotal:
          (item.quantity + 1)
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

      product_id:
      product.id,


      product_name:
      product.name,


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


cart.map(

(item:any,i:number)=>{



if(i!==index){

 return item;

}




let quantity =
item.quantity;





if(action==="add"){

 quantity++;

}



if(action==="remove"){

 quantity--;

}





if(quantity<=0){

 return null;

}





return {

 ...item,

 quantity,


 subtotal:
 quantity *
 item.price


};



}


)


.filter(Boolean)


);



}









function removeItem(

 index:number

){


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

sum + item.subtotal,


0

);


}









function change(){


return Math.max(

received - total(),


0

);


}
async function finishSale(){


  if(cart.length===0){

    alert(
      "Carrito vacío"
    );

    return;

  }




  if(!payment){

    alert(
      "Seleccione método de pago"
    );

    return;

  }





  const orderNumber =

    "PED-" +

    Date.now();






  /*
    1) CREAR ORDEN
  */


  const {

    data:order,

    error:orderError


  } = await supabase


  .from("orders")


  .insert({


    order_number:
    orderNumber,


    customer_name:
    "Mostrador",


    delivery_type:
    "MOSTRADOR",


    total:
    total(),


    status:
    "ENTREGADO",


    payment_status:
    "PAGADO",


    payment_method:
    payment


  })


  .select()


  .single();







  if(orderError){


    console.log(
      orderError
    );


    alert(
      orderError.message
    );


    return;


  }








  /*
    2) CREAR DETALLE DE PRODUCTOS
  */





  const {

    error:itemError


  } = await supabase


  .from("order_items")


  .insert(


    cart.map((item:any)=>(


      {


        order_id:
        order.id,


        product_name:
        item.product_name,


        quantity:
        item.quantity,


        price:
        item.price,


        size:
        item.size,


        subtotal:
        item.subtotal


      }


    ))


  );








  if(itemError){


    console.log(
      itemError
    );


    alert(
      itemError.message
    );


    return;


  }








  /*
    3) CREAR PAGO
  */





  const {

    error:paymentError


  } = await supabase


  .from("payments")


  .insert({



    order_id:
    order.id,


    method:
    payment,


    amount:
    total(),


    status:
    "PAGADO"



  });







  if(paymentError){


    console.log(
      paymentError
    );


    alert(
      paymentError.message
    );


    return;


  }








  /*
    4) MOVIMIENTO DE CAJA
  */





  const {

    error:cashError


  } = await supabase


  .from("cash_movements")


  .insert({


    type:
    "INGRESO",


    description:
    `Venta ${orderNumber}`,


    amount:
    total()


  });








  if(cashError){


    console.log(
      cashError
    );


    alert(
      cashError.message
    );


    return;


  }








  alert(

    `Venta realizada ${orderNumber}`

  );






  setCart([]);


  setReceived(0);


  setPayment("");



}
if(loading){

return (

<div className="
p-10
font-black
">

Cargando caja...

</div>

)

}







const filteredProducts = products.filter(

(product:any)=>

product.name

.toLowerCase()

.includes(

search.toLowerCase()

)

);







return (

<main className="
min-h-screen
bg-orange-50
p-4
">


<div className="
max-w-7xl
mx-auto
">





<h1 className="
text-3xl
font-black
text-gray-900
">

💰 Caja

</h1>




<p className="
text-gray-500
mb-5
">

Venta mostrador

</p>








<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-5
">









<section className="
bg-white
rounded-3xl
p-4
shadow
">


<h2 className="
text-xl
font-black
mb-3
">

Productos

</h2>






<input

placeholder="🔍 Buscar producto..."

value={search}

onChange={(e)=>

setSearch(
e.target.value
)

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
space-y-3
">


{

filteredProducts.map(

(product:any)=>(


<div

key={product.id}

className="
bg-gray-50
rounded-2xl
p-4
"

>



<p className="
font-black
mb-3
">

{product.name}

</p>






<div className="
grid
grid-cols-3
gap-2
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
bg-orange-500
text-white
rounded-xl
py-3
font-black
text-sm
"

>

½L

<br/>

${product.price_half}

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
bg-teal-600
text-white
rounded-xl
py-3
font-black
text-sm
"

>

Litro

<br/>

${product.price_liter}

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
bg-gray-900
text-white
rounded-xl
py-3
font-black
text-sm
"

>

Unidad

<br/>

${product.price_single}

</button>

}






</div>


</div>



)


)


}



</div>



</section>









<section className="
bg-white
rounded-3xl
p-4
shadow
">


<h2 className="
text-xl
font-black
mb-4
">

🛒 Pedido

</h2>






<div className="
space-y-3
max-h-96
overflow-y-auto
">





{

cart.map(

(item,index)=>(


<div

key={index}

className="
bg-gray-50
rounded-xl
p-3
flex
justify-between
items-center
"

>



<div>


<p className="
font-bold
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
items-center
gap-2
mt-2
">





<button

onClick={()=>updateQuantity(

index,

"remove"

)}

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

onClick={()=>updateQuantity(

index,

"add"

)}

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








<div className="
text-right
">


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



)


)



}



</div>









<div className="
border-t
mt-5
pt-5
">






<p className="
text-3xl
font-black
">

TOTAL:

${total()}

</p>







<input

type="number"

placeholder="💵 Dinero recibido"

value={received}

onChange={(e)=>

setReceived(

Number(e.target.value)

)

}

className="
w-full
mt-4
border
rounded-xl
p-3
text-lg
"

/>







<p className="
mt-3
text-xl
font-black
">

Cambio:

${change()}

</p>










<select

value={payment}

onChange={(e)=>

setPayment(

e.target.value

)

}

className="
w-full
mt-4
border
rounded-xl
p-3
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
mt-5
bg-green-600
text-white
py-4
rounded-2xl
font-black
text-lg
"

>

COBRAR

</button>







</div>



</section>







</div>





</div>



</main>


);


}