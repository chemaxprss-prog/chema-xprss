import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";


export async function checkPermission(
  section:string
){


const profile = await getUserProfile();



if(!profile){

redirect("/login");

}



if(
!canAccess(
profile.role,
section
)

){

redirect("/admin");

}



return profile;


}