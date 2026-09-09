"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function SettingsPage(){


const [loading,setLoading]=useState(true);
const [saving,setSaving]=useState(false);

const [uploadingLogo,setUploadingLogo]=useState(false);
const [uploadingHero,setUploadingHero]=useState(false);
const [uploadingHeroMobile,setUploadingHeroMobile]=useState(false);


const [logoPreview,setLogoPreview]=useState("");
const [heroPreview,setHeroPreview]=useState("");
const [heroMobilePreview,setHeroMobilePreview]=useState("");




const [form,setForm]=useState({

id:0,

business_name:"",

logo:"",

hero_image:"",

hero_mobile:"",

slogan:"",

whatsapp:"",

phone:"",

address:"",

opening_hours:"",

maps_url:"",

facebook:"",

instagram:"",

tiktok:"",

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

hero_image:data.hero_image || "",

hero_mobile:data.hero_mobile || "",

slogan:data.slogan || "",

whatsapp:data.whatsapp || "",

phone:data.phone || "",

address:data.address || "",

opening_hours:data.opening_hours || "",

maps_url:data.maps_url || "",

facebook:data.facebook || "",

instagram:data.instagram || "",

tiktok:data.tiktok || "",

bank_name:data.bank_name || "",

bank_account:data.bank_account || "",

bank_clabe:data.bank_clabe || "",

account_holder:data.account_holder || ""

});





setLogoPreview(data.logo || "");

setHeroPreview(data.hero_image || "");

setHeroMobilePreview(data.hero_mobile || "");



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









async function uploadImage(

e:React.ChangeEvent<HTMLInputElement>,

type:"logo"|"hero"|"heroMobile"

){



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





if(file.size > 3 * 1024 * 1024){

alert("La imagen no debe superar 3MB");

return;

}







try{



if(type==="logo"){

setUploadingLogo(true);

}


if(type==="hero"){

setUploadingHero(true);

}


if(type==="heroMobile"){

setUploadingHeroMobile(true);

}






const extension=file.name.split(".").pop();



const filename=

`${type}-${Date.now()}.${extension}`;






const {error}=await supabase.storage

.from("business-assets")

.upload(

filename,

file,

{

cacheControl:"3600",

upsert:false

}

);






if(error){

console.log(error);

alert("Error subiendo imagen");

return;

}







const {data}=supabase.storage

.from("business-assets")

.getPublicUrl(filename);







if(type==="logo"){


setForm({

...form,

logo:data.publicUrl

});


setLogoPreview(data.publicUrl);


}






if(type==="hero"){


setForm({

...form,

hero_image:data.publicUrl

});


setHeroPreview(data.publicUrl);


}







if(type==="heroMobile"){


setForm({

...form,

hero_mobile:data.publicUrl

});


setHeroMobilePreview(data.publicUrl);


}




}

finally{


setUploadingLogo(false);

setUploadingHero(false);

setUploadingHeroMobile(false);


}



}









async function saveSettings(){


setSaving(true);




const {error}=await supabase

.from("business_settings")

.update({


business_name:form.business_name,

logo:form.logo,

hero_image:form.hero_image,

hero_mobile:form.hero_mobile,

slogan:form.slogan,

whatsapp:form.whatsapp,

phone:form.phone,

address:form.address,

opening_hours:form.opening_hours,

maps_url:form.maps_url,

facebook:form.facebook,

instagram:form.instagram,

tiktok:form.tiktok,

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

Imágenes del negocio

</h2>







<p className="font-bold mb-3">

Logo

</p>



{

logoPreview &&

<img

src={logoPreview}

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

onChange={(e)=>uploadImage(e,"logo")}

className="
w-full
border
rounded-2xl
p-3
mb-6
"

/>










<p className="font-bold mb-3">

Imagen portada escritorio

</p>



{

heroPreview &&

<img

src={heroPreview}

className="
w-full
h-56
object-cover
rounded-3xl
border
mb-4
"

/>

}





<input

type="file"

accept="image/png,image/jpeg,image/webp"

onChange={(e)=>uploadImage(e,"hero")}

className="
w-full
border
rounded-2xl
p-3
mb-6
"

/>










<p className="font-bold mb-3">

Imagen portada móvil

</p>



{

heroMobilePreview &&

<img

src={heroMobilePreview}

className="
w-56
h-72
object-cover
rounded-3xl
border
mb-4
"

/>

}





<input

type="file"

accept="image/png,image/jpeg,image/webp"

onChange={(e)=>uploadImage(e,"heroMobile")}

className="
w-full
border
rounded-2xl
p-3
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

Información del negocio

</h2>





{

[

["business_name","Nombre del negocio"],

["slogan","Slogan"],

["whatsapp","WhatsApp"],

["phone","Teléfono"],

["address","Dirección"],

["opening_hours","Horario"],

["maps_url","Link Google Maps"]

].map(([name,placeholder])=>(


<input

key={name}

name={name}

value={(form as any)[name]}

onChange={handleChange}

placeholder={placeholder}

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>


))

}



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

Redes sociales

</h2>



{

[

["facebook","Facebook"],

["instagram","Instagram"],

["tiktok","TikTok"]

].map(([name,placeholder])=>(


<input

key={name}

name={name}

value={(form as any)[name]}

onChange={handleChange}

placeholder={placeholder}

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>


))


}



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





{

[

["bank_name","Banco"],

["bank_account","Cuenta"],

["bank_clabe","CLABE"],

["account_holder","Titular"]

].map(([name,placeholder])=>(


<input

key={name}

name={name}

value={(form as any)[name]}

onChange={handleChange}

placeholder={placeholder}

className="
w-full
border
rounded-2xl
p-4
mb-4
"

/>


))


}



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