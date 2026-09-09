import { createClient } from "@/lib/supabase-server";


export async function getUserProfile(){


const supabase = await createClient();



const {
data:{
user
},
error:userError

}=await supabase.auth.getUser();



console.log(
"USER SSR:",
user
);



if(userError || !user){


console.log(
"NO HAY USUARIO SSR"
);


return null;


}




const {
data:profile,
error:profileError

}=await supabase

.from("profiles")

.select("*")

.eq(

"user_id",

user.id

)

.single();



console.log(
"PROFILE SSR:",
profile
);



console.log(
"PROFILE ERROR SSR:",
profileError
);




if(profileError){


return null;


}




return profile;


}