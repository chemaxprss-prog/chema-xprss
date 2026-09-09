import MenuAccordion from "@/components/MenuAccordion";
import CartButton from "@/components/CartButton";
import { getMenu } from "@/lib/menu";


export default async function MenuPage(){


const products = await getMenu();





const menu = products.reduce((acc:any[], product:any)=>{


const categoryName = product.categories?.name;



let category = acc.find(

item=>item.category === categoryName

);





if(!category){


category={

category:categoryName,

image:product.categories?.image,

items:[]

};


acc.push(category);


}





category.items.push({


id:product.id,

name:product.name,

description:product.description,


sizes:[



...(product.price_half

?

[

{

name:"1/2 Litro",

price:product.price_half

}

]

:

[]

),





...(product.price_liter

?

[

{

name:"Litro",

price:product.price_liter

}

]

:

[]

),





...(product.price_single

?

[

{

name:"Unidad",

price:product.price_single

}

]

:

[]

)



]



});






return acc;


},[]);






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