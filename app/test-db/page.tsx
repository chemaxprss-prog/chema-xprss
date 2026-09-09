import { supabase } from "@/lib/supabase";


export default async function TestDB(){

  const { data, error } = await supabase
    .from("products")
    .select("*");


  return (
    <main className="p-10">

      <h1 className="text-3xl font-bold">
        Productos
      </h1>


      {error && (
        <p className="text-red-500">
          {error.message}
        </p>
      )}


      <pre className="mt-5 bg-gray-100 p-5 rounded-xl">
        {JSON.stringify(data,null,2)}
      </pre>


    </main>
  );
}