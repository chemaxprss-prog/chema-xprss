import { supabase } from "@/lib/supabase";



function getStartOfDay(date: Date){

  const start = new Date(date);

  start.setHours(0,0,0,0);

  return start.toISOString();

}



function getEndOfDay(date: Date){

  const end = new Date(date);

  end.setHours(23,59,59,999);

  return end.toISOString();

}





export async function getSalesByRange(
  start: Date,
  end: Date
){


  const {
    data,
    error

  } = await supabase

  .from("orders")

  .select(
    "id,total,created_at,status,payment_method"
  )

  .eq(
    "status",
    "ENTREGADO"
  )

  .gte(
    "created_at",
    start.toISOString()
  )

  .lte(
    "created_at",
    end.toISOString()
  );




  if(error){

    console.error(
      "Error ventas:",
      error
    );

    return {
      total:0,
      count:0,
      average:0
    };

  }




  const total =

    data?.reduce(
      (sum,order)=>

        sum + Number(order.total || 0),

      0

    ) || 0;




  const count =
    data?.length || 0;



  return {

    total,

    count,

    average:

      count > 0

      ?

      total / count

      :

      0

  };


}







export async function getSalesToday(){

 const now = new Date();


 return getSalesByRange(

   new Date(getStartOfDay(now)),

   new Date(getEndOfDay(now))

 );

}







export async function getSalesYesterday(){

 const date = new Date();


 date.setDate(
   date.getDate()-1
 );


 return getSalesByRange(

   new Date(getStartOfDay(date)),

   new Date(getEndOfDay(date))

 );

}







export async function getSalesThisWeek(){

 const today = new Date();


 const firstDay = new Date(today);


 firstDay.setDate(
   today.getDate()-today.getDay()
 );


 return getSalesByRange(

   new Date(getStartOfDay(firstDay)),

   new Date(getEndOfDay(today))

 );

}







export async function getSalesThisMonth(){

 const today = new Date();


 const firstDay = new Date(
   today.getFullYear(),
   today.getMonth(),
   1
 );


 return getSalesByRange(

   new Date(getStartOfDay(firstDay)),

   new Date(getEndOfDay(today))

 );

}









export async function getTopProducts(
 limit=10
){


 const {
   data,
   error

 } = await supabase


 .from("order_items")


 .select(
   `
   product_name,
   quantity,
   subtotal
   `
 );





 if(error){

   console.error(
    "Error productos:",
    error
   );

   return [];

 }





 const products: Record<string,{
  product_name:string;
  quantity:number;
  total:number;
}> = {};




 data?.forEach(item=>{


   if(!products[item.product_name]){


     products[item.product_name]={

       product_name:item.product_name,

       quantity:0,

       total:0

     };


   }




   products[item.product_name].quantity +=
      Number(item.quantity || 0);



   products[item.product_name].total +=
      Number(item.subtotal || 0);



 });






return Object.values(products)

.sort(
  (a,b)=>
  b.quantity - a.quantity
)

.slice(0,limit);



}









export async function getPaymentSummary(){


 const {
   data,
   error

 } = await supabase


 .from("orders")


 .select(
   "payment_method,total,status"
 )

 .eq(
   "status",
   "ENTREGADO"
 );





 if(error){

   console.error(
    "Error pagos:",
    error
   );

   return [];

 }





 const payments:any={};





 data?.forEach(order=>{


   const method =
    order.payment_method || "OTRO";



   payments[method] =
   (
    payments[method] || 0
   )
   +
   Number(order.total || 0);



 });







 return Object.entries(payments)

.map(
 ([method,total])=>({

   method,

   total:Number(total)

 })
);



}









export async function getSalesLastDays(
 days=7
){


 const result:any[]=[];


 const today=new Date();




 for(
   let i=days-1;
   i>=0;
   i--
 ){


   const date=new Date(today);


   date.setDate(
    today.getDate()-i
   );



   result.push({

    date:
    date.toISOString()
    .split("T")[0],


    day:
    date.toLocaleDateString(
      "es-ES",
      {
       weekday:"short"
      }
    )
    .replace(".",""),


    total:0

   });


 }




 const start=new Date(today);


 start.setDate(
  today.getDate()-days+1
 );


 start.setHours(
  0,0,0,0
 );





 const {
   data,
   error

 } = await supabase


 .from("orders")


 .select(
   "total,created_at,status"
 )


 .eq(
  "status",
  "ENTREGADO"
 )


 .gte(
  "created_at",
  start.toISOString()
 );





 if(error){

  console.error(
   "Error gráfico:",
   error
  );


  return result.map(item=>({

   day:item.day,

   total:item.total

  }));

 }



 data?.forEach(order=>{


   const date =
   new Date(order.created_at)
   .toISOString()
   .split("T")[0];



   const item =
   result.find(
    x=>x.date===date
   );



   if(item){

    item.total +=
    Number(order.total || 0);

   }


 });





 return result.map(item=>({

  day:item.day,

  total:item.total

 }));



}