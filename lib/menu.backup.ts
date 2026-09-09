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


  return data;

}
