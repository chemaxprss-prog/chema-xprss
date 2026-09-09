import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import DeleteUserButton from "@/components/DeleteUserButton";
import { checkPermission } from "../permissions";


export default async function UsersPage(){


await checkPermission("users");



const {
data:users,
error
}=await supabaseAdmin

.from("profiles")

.select("*")

.order(
"created_at",
{
ascending:false
}
);





return (

<div>



<div className="
flex
justify-between
items-center
mb-6
">


<h1 className="
text-3xl
font-black
">

Usuarios

</h1>




<Link

href="/admin/users/new"

className="
bg-teal-600
text-white
px-5
py-3
rounded-xl
font-black
"

>

+ Nuevo usuario

</Link>



</div>







<div className="
bg-white
rounded-2xl
shadow
p-5
space-y-3
">





{

error &&

<p className="
text-red-500
font-bold
">

{error.message}

</p>

}







{

users?.map((user:any)=>(


<div

key={user.id}

className="
border-b
py-4
flex
justify-between
items-center
"

>



<div>


<p className="
font-black
text-lg
">

{user.name}

</p>



<p className="
text-sm
text-gray-500
">

Rol: {user.role}

</p>



<p className="
text-xs
text-gray-400
">

ID:
{user.user_id}

</p>



</div>






{

user.role !== "superadmin" &&

<DeleteUserButton

userId={user.user_id}

/>


}



</div>



))


}





</div>


</div>


);


}