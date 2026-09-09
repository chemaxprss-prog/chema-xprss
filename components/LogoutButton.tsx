"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function LogoutButton(){


const router = useRouter();



async function logout(){


await supabase.auth.signOut();


router.push("/login");


router.refresh();


}




return (

<button

onClick={logout}

className="
w-full
mt-4
p-3
rounded-xl
font-black
bg-red-500
text-white
hover:bg-red-600
"

>

🚪 Cerrar sesión

</button>


);


}