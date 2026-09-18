import { supabase } from "@/lib/supabase";


export async function getCombos(){


const {data,error}=await supabase

.from("combos")

.select(`
id,
name,
description,
image,
price,
combo_items(
quantity,
products(
id,
name
)
)
`)

.eq("active",true)

.order("id");



if(error){

console.log(
"ERROR CARGANDO COMBOS:",
error
);

return [];

}



return data || [];


}