"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function LoginPage() {


  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  async function handleLogin(e: React.FormEvent) {

    e.preventDefault();


    setLoading(true);
    setError("");



    const { error } = await supabase.auth.signInWithPassword({

      email,

      password,

    });



    if (error) {

      console.log("ERROR LOGIN:", error);

      setError("Usuario o contraseña incorrectos");

      setLoading(false);

      return;

    }



    console.log("LOGIN CORRECTO");



    setLoading(false);



    router.refresh();



    router.push("/admin");


  }




  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      p-4
    ">



      <form

        onSubmit={handleLogin}

        className="
          bg-white
          w-full
          max-w-md
          rounded-2xl
          shadow-lg
          p-8
        "

      >



        <h1 className="
          text-3xl
          font-black
          text-center
          mb-2
        ">

          CHEMA XPRSS

        </h1>




        <p className="
          text-center
          text-gray-500
          mb-8
        ">

          Acceso administrativo

        </p>





        {error && (

          <div className="
            bg-red-100
            text-red-700
            p-3
            rounded-lg
            mb-4
          ">

            {error}

          </div>

        )}






        <input

          type="email"

          placeholder="Correo electrónico"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

          className="
            w-full
            border
            rounded-xl
            p-3
            mb-4
          "

          required

        />







        <input

          type="password"

          placeholder="Contraseña"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

          className="
            w-full
            border
            rounded-xl
            p-3
            mb-6
          "

          required

        />








        <button

          type="submit"

          disabled={loading}

          className="
            w-full
            bg-teal-600
            text-white
            font-bold
            py-3
            rounded-xl
          "

        >

          {loading ? "Ingresando..." : "Ingresar"}

        </button>





      </form>



    </main>

  );


}