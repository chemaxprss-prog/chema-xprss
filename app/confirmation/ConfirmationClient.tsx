import { Suspense } from "react";
import ConfirmationClient from "./ConfirmationClient";


export default function ConfirmationPage(){

return (

<Suspense

fallback={

<main className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
">

<p className="text-gray-700">
Cargando pedido...
</p>

</main>

}

>

<ConfirmationClient />

</Suspense>

);

}