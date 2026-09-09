import { supabase } from "./supabase";


export async function getMenu() {


  const { data, error } = await supabase

    .from("products")

    .select(`
      id,
      name,
      description,
      image,
      price_half,
      price_liter,
      price_single,
      position,

      categories (
        id,
        name,
        image
      )
    `)

    .eq("active", true)

    .order("position");



  if (error) {

    console.log(error);

    return [];

  }



  return data.map((product:any)=>(


    {

      ...product,


      sizes:[


        product.price_half
        ?

        {
          name:"1/2 Litro",
          label:"1/2 Litro",
          price:product.price_half
        }

        :

        null,



        product.price_liter
        ?

        {
          name:"Litro",
          label:"Litro",
          price:product.price_liter
        }

        :

        null


      ].filter(Boolean)



    }


  ));


}