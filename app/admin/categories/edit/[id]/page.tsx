"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function EditCategoryPage(){


const params = useParams();

const router = useRouter();

const id = String(params.id);





const [name,setName]=useState("");

const [position,setPosition]=useState("");



const [image,setImage]=useState("");

const [file,setFile]=useState<File|null>(null);

const [preview,setPreview]=useState("");



const [loading,setLoading]=useState(true);

const [saving,setSaving]=useState(false);









useEffect(()=>{


if(id){

loadCategory();

}


},[id]);









async function loadCategory(){



const {data,error}=await supabase

.from("categories")

.select("*")

.eq("id",id)

.single();





if(error){

console.log(error);

alert("No se pudo cargar la categoría");

return;

}





setName(data.name || "");

setPosition(
data.position ? String(data.position):""
);

setImage(data.image || "");

setPreview(data.image || "");

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









async function updateCategory(){



if(!name.trim()){

alert("Completa el nombre de la categoría");

return;

}



setSaving(true);





try{


const imageUrl=await uploadImage();





const {error}=await supabase

.from("categories")

.update({

name,

image:imageUrl || null,

position:

position

?

Number(position)

:

0

})

.eq("id",id);






if(error){

alert(error.message);

setSaving(false);

return;

}





alert("Categoría actualizada correctamente");


router.push("/admin/categories");





}catch(error){


console.log(error);

alert("Error actualizando categoría");


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

Cargando categoría...

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

✏️ Editar categoría

</h1>



<p className="
text-gray-600
mb-6
">

Actualizar categoría del menú CHEMA XPRSS

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

Información

</h2>






<input

value={name}

onChange={(e)=>setName(e.target.value)}

placeholder="Nombre categoría"

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

Orden del menú

</h2>






<input

value={position}

onChange={(e)=>setPosition(e.target.value)}

placeholder="Posición del menú"

type="number"

className="
w-full
border
rounded-2xl
p-4
"

/>






<p className="
text-gray-500
text-sm
mt-3
">

Define la ubicación de esta categoría dentro del menú.

</p>



</div>









<button

onClick={updateCategory}

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