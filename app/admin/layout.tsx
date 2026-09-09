import AdminShell from "./AdminShell";
import { getUserProfile } from "@/lib/auth";


export const dynamic = "force-dynamic";


export default async function AdminLayout({

children,

}:{

children: React.ReactNode;

}){


const profile = await getUserProfile();


return (

<AdminShell

role={profile?.role}

>

{children}

</AdminShell>

);

}