import { supabase } from "./supabase";


export interface BusinessSettings {

  id:number;

  business_name:string;

  logo:string | null;

  whatsapp:string | null;

  phone:string | null;

  address:string | null;

  bank_name:string | null;

  bank_account:string | null;

  bank_clabe:string | null;

  account_holder:string | null;

}




export async function getBusiness():Promise<BusinessSettings | null>{


  const { data, error } = await supabase
    .from("business_settings")
    .select(`
      id,
      business_name,
      logo,
      whatsapp,
      phone,
      address,
      bank_name,
      bank_account,
      bank_clabe,
      account_holder
    `)
    .limit(1)
    .single();



  if(error){

    console.log(
      "Error cargando configuración negocio:",
      error
    );

    return null;

  }



  return data;


}