"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";



export default function SettingsPage(){


const [loading,setLoading]=useState(true);

const [saving,setSaving]=useState(false);

const [uploading,setUploading]=useState(false);


const [preview,setPreview]=useState("");



const [form,setForm]=useState({

id:0,

business_name:"",

logo:"",

whatsapp:"",

phone:"",

address:"",

bank_name:"",

bank_account:"",

bank_clabe:"",

account_holder:""

});





useEffect(()=>{

loadSettings();

},[]);







async function loadSettings(){


const {data,error}=await supabase

.from("business_settings")

.select("*")

.limit(1)

.single();




if(error){

console.log(error);

setLoading(false);

return;

}



if(data){


setForm({

id:data.id,

business_name:data.business_name || "",

logo:data.logo || "",

whatsapp:data.whatsapp || "",

phone:data.phone || "",

address:data.address || "",

bank_name:data.bank_name || "",

bank_account:data.bank_account || "",

bank_clabe:data.bank_clabe || "",

account_holder:data.account_holder || ""

});


setPreview(data.logo || "");


}



setLoading(false);


}







function handleChange(
e:React.ChangeEvent<HTMLInputElement>
){


setForm({

...form,

[e.target.name]:e.target.value

});


}







async function uploadLogo(
e:React.ChangeEvent<HTMLInputElement>
){


try{


const file=e.target.files?.[0];


if(!file){

return;

}



const allowed=[

"image/png",

"image/jpeg",

"image/webp"

];



if(!allowed.includes(file.type)){

alert("Solo se permiten imágenes PNG, JPG o WEBP");

return;

}




if(file.size > 2 * 1024 * 1024){

alert("La imagen no debe superar 2MB");

return;

}




setUploading(true);




const extension=file.name.split(".").pop();



const filename=

`logo-${Date.now()}.${extension}`;





const {error:uploadError}=await supabase.storage

.from("business-assets")

.upload(
filename,
file,
{
cacheControl:"3600",
upsert:false
}
);





if(uploadError){

console.log(uploadError);

alert("Error subiendo logo");

setUploading(false);

return;

}






const {data}=supabase.storage

.from("business-assets")

.getPublicUrl(filename);






setForm({

...form,

logo:data.publicUrl

});



setPreview(data.publicUrl);



setUploading(false);



}

catch(error){


console.log(error);

setUploading(false);


}



}









async function saveSettings(){


setSaving(true);



const {error}=await supabase

.from("business_settings")

.update({

business_name:form.business_name,

logo:form.logo,

whatsapp:form.whatsapp,

phone:form.phone,

address:form.address,

bank_name:form.bank_name,

bank_account:form.bank_account,

bank_clabe:form.bank_clabe,

account_holder:form.account_holder

})

.eq(
"id",
form.id
);





if(error){

console.log(error);

alert("Error guardando configuración");

setSaving(false);

return;

}



alert("Configuración guardada correctamente");


setSaving(false);


}








if(loading){


return (

<div className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
">

Cargando configuración...

</div>

);


}







return (

<main className="
min-h-screen
bg-gray-100
p-5
">


<div className="
max-w-4xl
mx-auto
space-y-6
">






<h1 className="
text-4xl
font-extrabold
text-gray-900
">

⚙️ Configuración del negocio

</h1>








<section className="
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

Información del negocio

</h2>





<div className="
mb-5
">

<p className="
font-bold
mb-3
">

Logo del negocio

</p>




{

preview &&

<img

src={preview}

alt="Logo"

className="
w-40
h-40
object-contain
rounded-3xl
border
mb-4
"

/>

}





<input

type="file"

accept="image/png,image/jpeg,image/webp"

onChange={uploadLogo}

className="
w-full
border
rounded-2xl
p-3
"

/>




{

uploading &&

<p className="
text-teal-700
mt-2
font-bold
">

Subiendo imagen...

</p>

}



</div>







<input

name="business_name"

value={form.business_name}

onChange={handleChange}

placeholder="Nombre del negocio"

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<input

name="whatsapp"

value={form.whatsapp}

onChange={handleChange}

placeholder="WhatsApp"

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<input

name="phone"

value={form.phone}

onChange={handleChange}

placeholder="Teléfono"

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<input

name="address"

value={form.address}

onChange={handleChange}

placeholder="Dirección"

className="
w-full
border
rounded-2xl
p-4
"

/>



</section>









<section className="
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

Datos de transferencia

</h2>





<input

name="bank_name"

value={form.bank_name}

onChange={handleChange}

placeholder="Banco"

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<input

name="bank_account"

value={form.bank_account}

onChange={handleChange}

placeholder="Número de cuenta"

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<input

name="bank_clabe"

value={form.bank_clabe}

onChange={handleChange}

placeholder="CLABE"

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>





<input

name="account_holder"

value={form.account_holder}

onChange={handleChange}

placeholder="Titular"

className="
w-full
border
rounded-2xl
p-4
"

/>



</section>








<button

onClick={saveSettings}

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
"

>

{

saving

?

"Guardando..."

:

"Guardar configuración"

}


</button>







</div>


</main>

);


}