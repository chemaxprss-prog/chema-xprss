"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function EditProductPage(){


const params = useParams();

const router = useRouter();

const id = String(params.id);



const [categories,setCategories]=useState<any[]>([]);


const [name,setName]=useState("");

const [description,setDescription]=useState("");

const [category,setCategory]=useState("");



const [image,setImage]=useState("");

const [file,setFile]=useState<File|null>(null);

const [preview,setPreview]=useState("");



const [priceHalf,setPriceHalf]=useState("");

const [priceLiter,setPriceLiter]=useState("");

const [priceSingle,setPriceSingle]=useState("");



const [loading,setLoading]=useState(true);

const [saving,setSaving]=useState(false);









useEffect(()=>{


if(id){

loadData();

}


},[id]);









async function loadData(){



const {data:product,error}=await supabase

.from("products")

.select("*")

.eq("id",id)

.single();





if(error){

console.log(error);

alert("No se pudo cargar el producto");

return;

}





setName(product.name || "");

setDescription(product.description || "");

setCategory(String(product.category_id || ""));

setImage(product.image || "");

setPreview(product.image || "");

setPriceHalf(
product.price_half ? String(product.price_half):""
);

setPriceLiter(
product.price_liter ? String(product.price_liter):""
);

setPriceSingle(
product.price_single ? String(product.price_single):""
);







const {data:cats,error:catError}=await supabase

.from("categories")

.select("*")

.order("position");




if(!catError){

setCategories(cats || []);

}



setLoading(false);



}








function selectImage(e:any){


const selected=e.target.files?.[0];


if(!selected) return;



if(!selected.type.startsWith("image/")){

alert("Selecciona una imagen válida");

return;

}



setFile(selected);


setPreview(

URL.createObjectURL(selected)

);



}








async function uploadImage(){



if(!file){

return image;

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









async function updateProduct(){


if(!name || !category){

alert("Completa nombre y categoría");

return;

}



setSaving(true);





try{


const imageUrl=await uploadImage();





const {error}=await supabase

.from("products")

.update({

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

})

.eq("id",id);






if(error){

alert(error.message);

setSaving(false);

return;

}





alert("Producto actualizado correctamente");


router.push("/admin/products");





}catch(error){


console.log(error);

alert("Error actualizando producto");


}




setSaving(false);



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

Cargando producto...

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
max-w-3xl
mx-auto
">






<h1 className="
text-4xl
font-extrabold
text-gray-900
mb-2
">

✏️ Editar producto

</h1>


<p className="
text-gray-600
mb-6
">

Actualizar información del menú CHEMA XPRSS

</p>









<div className="space-y-5">







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

value={name}

onChange={(e)=>setName(e.target.value)}

placeholder="Nombre del producto"

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

value={description}

onChange={(e)=>setDescription(e.target.value)}

placeholder="Descripción"

className="
w-full
border
rounded-2xl
p-4
h-32
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
font-extrabold
text-teal-700
mb-5
">

Imagen del producto

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


📷 Cambiar imagen



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

value={priceHalf}

onChange={(e)=>setPriceHalf(e.target.value)}

type="number"

placeholder="🥤 Precio 1/2 Litro"

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>






<input

value={priceLiter}

onChange={(e)=>setPriceLiter(e.target.value)}

type="number"

placeholder="🥤 Precio Litro"

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>






<input

value={priceSingle}

onChange={(e)=>setPriceSingle(e.target.value)}

type="number"

placeholder="🍽 Precio Unidad"

className="
w-full
border
rounded-2xl
p-4
"

/>



</div>









<button

onClick={updateProduct}

disabled={saving}

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

saving

?

"Guardando cambios..."

:

"Guardar cambios"

}



</button>







</div>






</div>


</main>


);


}