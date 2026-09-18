import MenuAccordion from "@/components/MenuAccordion";
import CartButton from "@/components/CartButton";

import { getMenu } from "@/lib/menu";
import { getCombos } from "@/lib/combos";


export const dynamic = "force-dynamic";



export default async function MenuPage(){



const products = await getMenu();


const combos = await getCombos();





console.log(
"COMBOS RECIBIDOS MENU:",
JSON.stringify(combos,null,2)
);







const menu = (products || []).reduce(

(acc:any[], product:any)=>{


const categoryName =

product.categories?.name || "Sin categoría";



let category = acc.find(

(item)=>item.category === categoryName

);





if(!category){


category={

category:categoryName,

image:
product.categories?.image || "",

items:[]

};


acc.push(category);


}







category.items.push({


id:product.id,

name:product.name,

description:product.description,

sizes:product.sizes || []


});





return acc;


},[]);











// AGREGAR COMBOS COMO UNA CATEGORIA MÁS DEL MENÚ

if(combos.length){


menu.push({

category:"🔥 Combos",

image:combos[0]?.image || "",

items:combos.map((combo:any)=>(


{


id:`combo-${combo.id}`,

name:combo.name,

description:combo.description,

sizes:[

{

name:"Combo",

price:combo.price

}

],


combo_items:combo.combo_items


}



))


});


}









return (

<main className="
min-h-screen
bg-gray-100
p-5
pb-32
">





<h1 className="
text-4xl
font-black
text-center
text-gray-900
mb-8
">

🍤 Nuestro Menú

</h1>







<div className="
max-w-5xl
mx-auto
space-y-5
">



{

menu.map((category:any)=>(


<MenuAccordion

key={category.category}

category={category}

/>


))


}



</div>









<CartButton />





</main>

);


}