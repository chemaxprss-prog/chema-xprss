import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";


export async function DELETE(req: Request){

try{


const { user_id } = await req.json();



console.log(
"ELIMINANDO USUARIO:",
user_id
);




if(!user_id){

throw new Error(
"Falta user_id"
);

}




// eliminar profile

const {
error:profileError

}=await supabaseAdmin

.from("profiles")

.delete()

.eq(
"user_id",
user_id
);



if(profileError){

throw profileError;

}





// eliminar usuario de Auth

const {
error:authError

}=await supabaseAdmin.auth.admin.deleteUser(

user_id

);



if(authError){

throw authError;

}




return NextResponse.json({

ok:true

});


}

catch(error:any){


console.log(
"ERROR ELIMINANDO:",
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