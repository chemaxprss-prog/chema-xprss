"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function NewComboPage(){


const router = useRouter();



const [products,setProducts]=useState<any[]>([]);

const [selected,setSelected]=useState<any[]>([]);



const [name,setName]=useState("");

const [description,setDescription]=useState("");

const [price,setPrice]=useState("");



const [file,setFile]=useState<File|null>(null);

const [preview,setPreview]=useState("");



const [loading,setLoading]=useState(false);






useEffect(()=>{

loadProducts();

},[]);






async function loadProducts(){


const {data,error}=await supabase

.from("products")

.select(`
id,
name,
image
`)

.eq("active",true)

.order("name");





if(error){

console.log(error);

return;

}



setProducts(data || []);


}









function selectImage(e:any){


const selectedFile=e.target.files?.[0];


if(!selectedFile)return;



setFile(selectedFile);


setPreview(
URL.createObjectURL(selectedFile)
);


}









function toggleProduct(product:any){


const exists = selected.find(
item=>item.id===product.id
);





if(exists){


setSelected(

selected.filter(
item=>item.id!==product.id
)

);


return;

}






setSelected([

...selected,

{

id:product.id,

quantity:1

}

]);


}









function updateQuantity(
id:number,
quantity:number
){


setSelected(

selected.map(item=>


item.id===id

?

{

...item,

quantity

}

:

item


)

);


}









async function uploadImage(){


if(!file)return "";





const fileName=

`${Date.now()}-${file.name.replace(/\s/g,"-")}`;





const {error}=await supabase.storage

.from("product-images")

.upload(
fileName,
file
);





if(error){

throw error;

}





const {data}=supabase.storage

.from("product-images")

.getPublicUrl(fileName);





return data.publicUrl;


}









async function saveCombo(){



if(!name || !price || selected.length===0){


alert(
"Completa nombre, precio y productos"
);


return;


}




setLoading(true);





try{



const imageUrl=await uploadImage();






const {data:combo,error:comboError}=await supabase

.from("combos")

.insert({

name,

description,

price:Number(price),

image:imageUrl || null,

active:true

})

.select()

.single();






if(comboError){

throw comboError;

}








const comboItems=selected.map(item=>(


{

combo_id:combo.id,

product_id:item.id,

quantity:item.quantity

}


));







const {error:itemError}=await supabase

.from("combo_items")

.insert(comboItems);





if(itemError){

throw itemError;

}






alert("Combo creado correctamente");


router.push("/admin/combos");





}catch(error:any){


console.log(error);

alert(error.message || "Error creando combo");


}




setLoading(false);


}









return (

<main className="
min-h-screen
bg-gray-100
p-5
pb-10
">



<div className="
max-w-4xl
mx-auto
">





<h1 className="
text-4xl
font-extrabold
text-gray-900
mb-6
">

🔥 Crear combo

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
font-bold
text-teal-700
mb-5
">

Información

</h2>




<input

placeholder="Nombre del combo"

value={name}

onChange={(e)=>setName(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<textarea

placeholder="Descripción"

value={description}

onChange={(e)=>setDescription(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
mb-4
h-32
"

/>





<input

type="number"

placeholder="Precio"

value={price}

onChange={(e)=>setPrice(e.target.value)}

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
font-bold
text-teal-700
mb-5
">

Imagen

</h2>





<input

type="file"

accept="image/*"

onChange={selectImage}

/>





{

preview &&

<img

src={preview}

className="
mt-4
w-full
h-56
object-cover
rounded-3xl
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
font-bold
text-teal-700
mb-5
">

Productos del combo

</h2>






<div className="
space-y-3
">


{

products.map(product=>{


const item=
selected.find(
x=>x.id===product.id
);



return (

<div

key={product.id}

className="
border
rounded-2xl
p-4
flex
justify-between
items-center
"

>


<div>

<p className="
font-bold
">

{product.name}

</p>


{

item &&

<input

type="number"

min="1"

value={item.quantity}

onChange={(e)=>
updateQuantity(
product.id,
Number(e.target.value)
)
}

className="
border
rounded-xl
p-2
w-20
mt-2
"

/>


}


</div>





<button

onClick={()=>toggleProduct(product)}

className={`
px-4
py-2
rounded-full
font-bold

${

item

?

"bg-green-500 text-white"

:

"bg-gray-200"

}

`}

>

{

item

?

"Agregado"

:

"Agregar"

}


</button>



</div>


)


})


}



</div>



</div>








<button

onClick={saveCombo}

disabled={loading}

className="
w-full
bg-orange-500
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

"Guardando..."

:

"Crear combo"

}


</button>






</div>



</div>


</main>


);


}