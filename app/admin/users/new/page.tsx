"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function NewUserPage(){

const router = useRouter();


const [loading,setLoading] = useState(false);


const [form,setForm] = useState({

name:"",
email:"",
password:"",
role:"cajero"

});



function update(
e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
){

setForm({

...form,

[e.target.name]:e.target.value

});

}





async function createUser(){


setLoading(true);


try{


const res = await fetch(

"/api/admin/users",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

...form

})

}

);



const data = await res.json();



console.log(data);



if(data.ok){


alert("Usuario creado correctamente");


router.push("/admin/users");


}

else{


alert(data.error);


}



}

catch(error:any){


console.log(error);


alert(error.message);


}



setLoading(false);


}






return (

<div className="max-w-xl">


<h1 className="
text-3xl
font-black
mb-6
">

Nuevo usuario

</h1>




<div className="
bg-white
rounded-2xl
p-6
space-y-4
shadow
">





<input

name="name"

placeholder="Nombre"

className="
w-full
border
p-3
rounded-xl
"

onChange={update}

/>





<input

name="email"

placeholder="Correo"

type="email"

className="
w-full
border
p-3
rounded-xl
"

onChange={update}

/>





<input

name="password"

placeholder="Contraseña"

type="password"

className="
w-full
border
p-3
rounded-xl
"

onChange={update}

/>





<select

name="role"

className="
w-full
border
p-3
rounded-xl
"

value={form.role}

onChange={update}

>


<option value="cajero">

Cajero

</option>


<option value="cocina">

Cocina

</option>


<option value="admin">

Administrador

</option>



</select>





<button

onClick={createUser}

disabled={loading}

className="
w-full
bg-teal-600
text-white
font-black
p-3
rounded-xl
"

>


{

loading

?

"Creando..."

:

"Crear usuario"

}



</button>





</div>


</div>


);


}