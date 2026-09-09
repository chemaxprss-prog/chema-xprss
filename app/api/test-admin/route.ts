import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";


export async function GET(){


const { data, error } = await supabaseAdmin
.from("profiles")
.select("*")
.limit(1);



if(error){

return NextResponse.json({

ok:false,

error:error.message

});

}



return NextResponse.json({

ok:true,

data

});


}