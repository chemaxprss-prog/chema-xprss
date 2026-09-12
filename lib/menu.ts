import { supabase } from "./supabase";


export async function getMenu() {


  const { data, error } = await supabase

    .from("products")

    .select(`

      id,
      name,
      description,
      image,
      position,

      categories (
        id,
        name,
        image
      ),

      product_variants (
        id,
        name,
        code,
        price,
        active
      )

    `)

    .eq("active", true)

    .order("position");



  if(error){

    console.log("ERROR GET MENU:", error);

    return [];

  }



  console.log(
    "PRODUCTOS MENU COMPLETO:",
    data
  );



  return (data || []).map((product:any)=>{


    const variants =

      (product.product_variants || [])

      .filter(
        (variant:any)=>variant.active
      )

      .map((variant:any)=>{


        return {

          id:variant.id,

          /*
          Este es el nombre visible
          ejemplo:
          Litro
          Individual
          1/2 Litro
          */

          name:variant.name,


          /*
          Este es el código interno
          ejemplo:
          LITER
          SINGLE
          HALF
          */

          code:variant.code,


          price:Number(
            variant.price
          )


        };


      });




    console.log(
      "VARIANTES PRODUCTO:",
      product.name,
      variants
    );




    return {


      ...product,


      sizes:variants


    };


  });



}