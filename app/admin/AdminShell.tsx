"use client";

import { useState } from "react";
import AdminMenu from "./AdminMenu";


export default function AdminShell({
  children,
  role,
}:{
  children: React.ReactNode;
  role?: string;
}){


const [open,setOpen]=useState(false);



return (

<div className="
min-h-screen
bg-gray-100
flex
">


<aside className="
hidden
md:block
w-64
bg-white
border-r
">


<AdminMenu role={role}/>


</aside>





{
open &&

<div

className="
fixed
inset-0
z-50
bg-black/40
md:hidden
"

onClick={()=>setOpen(false)}

>


<div

className="
w-72
h-full
bg-white
p-4
"

onClick={(e)=>e.stopPropagation()}

>


<button

onClick={()=>setOpen(false)}

className="
mb-5
text-2xl
font-black
"

>

✕ Cerrar

</button>


<AdminMenu role={role}/>


</div>


</div>

}





<main className="
flex-1
p-4
w-full
">


<div className="
md:hidden
mb-4
">


<button

onClick={()=>setOpen(true)}

className="
bg-teal-600
text-white
px-5
py-3
rounded-xl
font-black
shadow
"

>

☰ Menú

</button>


</div>



{children}


</main>


</div>

);


}