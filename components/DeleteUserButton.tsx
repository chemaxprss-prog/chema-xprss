"use client";



export default function DeleteUserButton({
  userId
}:{
  userId:string
}){


async function deleteUser(){


const ok = confirm(
"¿Seguro que deseas eliminar este usuario?"
);


if(!ok) return;



const res = await fetch(

"/api/admin/users/delete",

{

method:"DELETE",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

user_id:userId

})

}

);



const data = await res.json();



if(data.ok){

location.reload();

}

else{

alert(data.error);

}


}




return (

<button

onClick={deleteUser}

className="
bg-red-500
hover:bg-red-600
text-white
font-black
px-4
py-2
rounded-xl
"

>

Eliminar

</button>


);


}