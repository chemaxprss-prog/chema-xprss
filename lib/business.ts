import { supabase } from "./supabase";


export interface BusinessSettings {

  id:number;

  business_name:string;

  logo:string | null;

  hero_image:string | null;

  hero_mobile:string | null;

  slogan:string | null;

  whatsapp:string | null;

  phone:string | null;

  address:string | null;

  opening_hours:string | null;

  maps_url:string | null;

  facebook:string | null;

  instagram:string | null;

  tiktok:string | null;

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
      hero_image,
      hero_mobile,
      slogan,
      whatsapp,
      phone,
      address,
      opening_hours,
      maps_url,
      facebook,
      instagram,
      tiktok,
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