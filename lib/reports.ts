import { supabase } from "@/lib/supabase";



function getStartOfDay(date: Date){

  const start = new Date(date);

  start.setHours(0,0,0,0);

  return start;

}



function getEndOfDay(date: Date){

  const end = new Date(date);

  end.setHours(23,59,59,999);

  return end;

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
    `
    id,
    total,
    created_at,
    status
    `
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

getStartOfDay(now),

getEndOfDay(now)

);


}









export async function getSalesYesterday(){

const date = new Date();


date.setDate(
date.getDate()-1
);



return getSalesByRange(

getStartOfDay(date),

getEndOfDay(date)

);


}









export async function getSalesThisWeek(){

const today = new Date();


const firstDay = new Date(today);


firstDay.setDate(
today.getDate()-today.getDay()
);



return getSalesByRange(

getStartOfDay(firstDay),

getEndOfDay(today)

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

getStartOfDay(firstDay),

getEndOfDay(today)

);


}









// PRODUCTOS MAS VENDIDOS

export async function getTopProducts(
limit = 10
){


const {

data,

error

}=await supabase

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





const products:

Record<

string,

{

product_name:string;

quantity:number;

total:number;

}

>

={};






data?.forEach((item)=>{


const name =
item.product_name || "SIN NOMBRE";



if(!products[name]){


products[name]={

product_name:name,

quantity:0,

total:0

};


}




products[name].quantity +=

Number(
item.quantity || 0
);



products[name].total +=

Number(
item.subtotal || 0
);



});







return Object.values(products)

.sort(

(a,b)=>

b.quantity-a.quantity

)

.slice(
0,
limit
);



}









// METODOS DE PAGO

export async function getPaymentSummary(){


const {

data,

error

}=await supabase


.from("payments")

.select(
`
method,
amount,
status
`
)

.eq(
"status",
"PAGADO"
);





if(error){

console.error(
"Error pagos:",
error
);

return [];

}





const payments:

Record<string,number>

={};






data?.forEach((payment)=>{


const method =

payment.method ||

"OTRO";




payments[method]=

(

payments[method] || 0

)

+

Number(
payment.amount || 0
);



});






return Object.entries(payments)

.map(

([method,total])=>(

{

method,

total

}

)

);



}









// GRAFICA ULTIMOS DIAS

export async function getSalesLastDays(
days = 7
){


const result:any[]=[];


const today = new Date();





for(
let i = days-1;

i>=0;

i--
){



const date = new Date(today);



date.setDate(

today.getDate()-i

);




result.push({

date:

date.toISOString()
.split("T")[0],


day:

date.toLocaleDateString(

"es-MX",

{

weekday:"short"

}

)
.replace(".",""),



total:0


});


}







const start = new Date(today);


start.setDate(

today.getDate()-days+1

);



start.setHours(
0,
0,
0,
0
);







const {

data,

error

}=await supabase


.from("orders")

.select(
`
total,
created_at,
status
`
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
"Error gráfica:",
error
);


return result.map(item=>({

day:item.day,

total:item.total

}));



}







data?.forEach((order)=>{



const day =

new Date(order.created_at)

.toISOString()

.split("T")[0];





const item =

result.find(

x=>x.date===day

);





if(item){

item.total +=

Number(
order.total || 0
);

}


});






return result.map(item=>(

{

day:item.day,

total:item.total

}

));



}