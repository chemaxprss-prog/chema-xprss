import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";


export async function DELETE(req:Request){

try{


const body = await req.json();


console.log(
"DELETE RECIBIDO:",
body
);



const {
user_id
}=body;



if(!user_id){

throw new Error(
"No llegó user_id"
);

}




// borrar profile

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

console.log(
"ERROR PROFILE:",
profileError
);

throw profileError;

}




// borrar usuario auth

const {
error:authError
}=await supabaseAdmin.auth.admin.deleteUser(

user_id

);



if(authError){

console.log(
"ERROR AUTH:",
authError
);

throw authError;

}




return NextResponse.json({

ok:true

});


}

catch(error:any){


console.log(
"ERROR DELETE:",
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