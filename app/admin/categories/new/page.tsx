"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function NewCategoryPage(){


const router = useRouter();


const [name,setName]=useState("");

const [position,setPosition]=useState("");

const [file,setFile]=useState<File|null>(null);

const [preview,setPreview]=useState("");

const [loading,setLoading]=useState(false);








function selectImage(e:any){


const image=e.target.files?.[0];


if(!image) return;




if(!image.type.startsWith("image/")){

alert("Selecciona una imagen válida");

return;

}



setFile(image);


setPreview(

URL.createObjectURL(image)

);



}









async function uploadImage(){


if(!file){

return "";

}



const fileName=

`${Date.now()}-${file.name.replace(/\s/g,"-")}`;





const {error}=await supabase.storage

.from("category-images")

.upload(
fileName,
file
);





if(error){

throw error;

}





const {data}=supabase.storage

.from("category-images")

.getPublicUrl(fileName);



return data.publicUrl;



}









async function saveCategory(){


if(!name.trim()){

alert("Escribe el nombre de la categoría");

return;

}



setLoading(true);






try{


const imageUrl=await uploadImage();





const {error}=await supabase

.from("categories")

.insert({

name:name,

image:imageUrl || null,

position:

position

?

Number(position)

:

0

});






if(error){

alert(error.message);

setLoading(false);

return;

}





alert("Categoría creada correctamente");


router.push("/admin/categories");





}catch(error){


console.log(error);

alert("Error subiendo imagen");


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

📂 Nueva categoría

</h1>



<p className="
text-gray-600
mb-6
">

Crear categoría para el menú CHEMA XPRSS

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

Información

</h2>






<input

placeholder="Nombre de categoría"

value={name}

onChange={(e)=>setName(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
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

Imagen de categoría

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









{/* ORDEN */}

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

Orden del menú

</h2>






<input

placeholder="Posición (ejemplo: 1)"

type="number"

value={position}

onChange={(e)=>setPosition(e.target.value)}

className="
w-full
border
rounded-2xl
p-4
"

/>




<p className="
text-sm
text-gray-500
mt-3
">

Define el orden en que aparecerá la categoría en el menú.

</p>



</div>









<button

onClick={saveCategory}

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

"Guardando categoría..."

:

"Guardar categoría"

}



</button>






</div>






</div>


</main>

);


}