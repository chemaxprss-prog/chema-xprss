import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";


export async function POST(req: Request){


try{


const body = await req.json();


const {
name,
email,
password,
role
}=body;



// Cliente servidor para obtener usuario logueado

const supabase = await createClient();



const {
data:{
user
}

}=await supabase.auth.getUser();



if(!user){

return NextResponse.json({

ok:false,

error:"No autorizado"

},
{
status:401
}

);

}




// Buscar perfil del creador

const {
data:profile,
error:profileError

}=await supabaseAdmin

.from("profiles")

.select("business_id, role")

.eq(
"user_id",
user.id
)

.single();



if(profileError || !profile){

throw new Error(
"No se encontró perfil del administrador"
);

}




if(profile.role !== "superadmin" && profile.role !== "admin"){

throw new Error(
"Sin permisos para crear usuarios"
);

}




// Crear usuario Auth

const {
data:userData,
error:userError

}=await supabaseAdmin.auth.admin.createUser({

email,

password,

email_confirm:true

});



if(userError){

throw userError;

}




// Crear perfil nuevo

const {
error:createProfileError

}=await supabaseAdmin

.from("profiles")

.insert({

user_id:userData.user.id,

name,

role,

business_id:profile.business_id

});



if(createProfileError){

throw createProfileError;

}




return NextResponse.json({

ok:true,

message:"Usuario creado correctamente"

});


}


catch(error:any){


console.log(
"ERROR CREANDO USUARIO:",
error
);



return NextResponse.json({

ok:false,

error:error.message

},
{
status:500
}

);


}


}