"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function NewProductPage(){


const router = useRouter();



const [categories,setCategories]=useState<any[]>([]);


const [name,setName]=useState("");

const [description,setDescription]=useState("");

const [category,setCategory]=useState("");


const [file,setFile]=useState<File|null>(null);

const [preview,setPreview]=useState("");



const [priceHalf,setPriceHalf]=useState("");

const [priceLiter,setPriceLiter]=useState("");

const [priceSingle,setPriceSingle]=useState("");



const [loading,setLoading]=useState(false);






useEffect(()=>{

loadCategories();

},[]);







async function loadCategories(){


const {data,error}=await supabase

.from("categories")

.select("*")

.order("position");



if(error){

console.log(error);

return;

}



setCategories(data || []);



}







function selectImage(e:any){


const selected=e.target.files?.[0];


if(!selected) return;




if(!selected.type.startsWith("image/")){

alert("Solo se permiten imágenes");

return;

}



setFile(selected);


setPreview(
URL.createObjectURL(selected)
);



}








async function uploadImage(){


if(!file){

return "";

}



const fileName =

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









async function saveProduct(){



if(!name || !category){


alert("Completa nombre y categoría");

return;


}



setLoading(true);





try{


const imageUrl=await uploadImage();





const {error}=await supabase

.from("products")

.insert({

name,

description:description || null,

category_id:Number(category),

image:imageUrl || null,

price_half:
priceHalf ? Number(priceHalf):null,

price_liter:
priceLiter ? Number(priceLiter):null,

price_single:
priceSingle ? Number(priceSingle):null

});





if(error){

alert(error.message);

setLoading(false);

return;

}





alert("Producto creado correctamente");


router.push("/admin/products");





}catch(error){


console.log(error);

alert("Error creando producto");


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
max-w-3xl
mx-auto
">






<h1 className="
text-4xl
font-extrabold
text-gray-900
mb-2
">

🍤 Nuevo producto

</h1>


<p className="
text-gray-600
mb-6
">

Crear producto para el menú CHEMA XPRSS

</p>









<div className="space-y-5">







{/* INFORMACION */}

<div className="
bg-white
rounded-3xl
shadow-md
p-6
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-5
">

Información del producto

</h2>





<input

placeholder="Nombre del producto"

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






<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
mb-4
"

>


<option value="">

Seleccionar categoría

</option>



{

categories.map(cat=>(


<option

key={cat.id}

value={cat.id}

>

{cat.name}

</option>


))


}



</select>






<textarea

placeholder="Descripción del producto"

value={description}

onChange={(e)=>setDescription(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
h-32
"

/>



</div>









{/* IMAGEN */}

<div className="
bg-white
rounded-3xl
shadow-md
p-6
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-5
">

Imagen

</h2>





<label className="
block
border-2
border-dashed
rounded-3xl
p-6
text-center
cursor-pointer
font-bold
text-gray-700
">


📷 Seleccionar imagen



<input

type="file"

accept="image/*"

onChange={selectImage}

className="hidden"

/>



</label>








{

preview &&


<img

src={preview}

className="
mt-5
w-full
h-56
object-cover
rounded-3xl
"

/>


}



</div>









{/* PRECIOS */}

<div className="
bg-white
rounded-3xl
shadow-md
p-6
">


<h2 className="
text-xl
font-extrabold
text-teal-700
mb-5
">

Precios

</h2>





<input

type="number"

placeholder="🥤 Precio 1/2 Litro"

value={priceHalf}

onChange={(e)=>setPriceHalf(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<input

type="number"

placeholder="🥤 Precio Litro"

value={priceLiter}

onChange={(e)=>setPriceLiter(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<input

type="number"

placeholder="🍽 Precio Unidad"

value={priceSingle}

onChange={(e)=>setPriceSingle(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
"

/>



</div>









<button

onClick={saveProduct}

disabled={loading}

className="
w-full
bg-orange-500
hover:bg-orange-600
text-white
py-5
rounded-full
font-extrabold
text-lg
shadow-lg
active:scale-95
transition
"

>


{

loading

?

"Guardando producto..."

:

"Guardar producto"

}



</button>







</div>






</div>


</main>

);


}