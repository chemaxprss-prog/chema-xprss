"use client";


export default function ComboSection({
combos
}:{
combos:any[]
}){


if(!combos || combos.length===0){

return null;

}



return (

<section className="
max-w-5xl
mx-auto
mt-10
">


<h2 className="
text-3xl
font-black
text-gray-900
mb-6
">

🔥 Combos especiales

</h2>





<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
">



{

combos.map((combo:any)=>(


<div

key={combo.id}

className="
bg-white
rounded-3xl
shadow-md
p-5
"

>





{

combo.image &&

<img

src={combo.image}

alt={combo.name}

className="
w-full
h-52
object-cover
rounded-2xl
mb-5
"

/>

}





<h3 className="
text-2xl
font-black
text-teal-700
">

{combo.name}

</h3>






{

combo.description &&

<p className="
text-gray-600
mt-2
">

{combo.description}

</p>

}





<div className="
text-2xl
font-black
text-orange-600
mt-4
">

${combo.price}

</div>







<div className="
mt-5
bg-gray-50
rounded-2xl
p-4
">


<h4 className="
font-bold
text-gray-800
mb-3
">

Incluye:

</h4>





{

combo.combo_items?.map((item:any)=>(


<div

key={item.product_id}

className="
text-gray-700
mb-2
"

>

✅ {item.products?.name}

{" x"}

{item.quantity}


</div>


))


}



</div>








<button

className="
mt-5
w-full
bg-orange-500
hover:bg-orange-600
text-white
py-4
rounded-full
font-extrabold
transition
"

>

Agregar combo 🛒

</button>






</div>


))


}



</div>



</section>


);


}