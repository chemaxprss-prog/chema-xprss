import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BusinessInfo from "@/components/landing/BusinessInfo";
import MenuSection from "@/components/landing/MenuSection";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/landing/WhatsAppButton";

import { getMenu } from "@/lib/menu";
import { getBusiness } from "@/lib/business";


export const dynamic = "force-dynamic";


export default async function Home(){


const products = await getMenu();

const business = await getBusiness();





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

image:product.categories?.image || "",

items:[]

};


acc.push(category);


}






category.items.push({


id:product.id,

name:product.name,

description:product.description,



sizes:[


...(Number(product.price_half) > 0

?

[

{

name:"1/2 Litro",

price:Number(product.price_half)

}

]

:

[]
),





...(Number(product.price_liter) > 0

?

[

{

name:"Litro",

price:Number(product.price_liter)

}

]

:

[]
),





...(Number(product.price_single) > 0

?

[

{

name:"Unidad",

price:Number(product.price_single)

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
bg-black
min-h-screen
">





<Navbar

business={business}

/>






<Hero

business={business}

/>






<BusinessInfo

business={business}

/>






<MenuSection

menu={menu}

/>






<Features />







<Footer

business={business}

/>







<WhatsAppButton

business={business}

/>





</main>

);


}