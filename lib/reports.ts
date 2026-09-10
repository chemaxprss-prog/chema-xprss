import { supabase } from "@/lib/supabase";



function getStartOfDay(date:Date){

  const start = new Date(date);

  start.setHours(
    0,
    0,
    0,
    0
  );

  return start.toISOString();

}



function getEndOfDay(date:Date){

  const end = new Date(date);

  end.setHours(
    23,
    59,
    59,
    999
  );

  return end.toISOString();

}





// ===============================
// VENTAS GENERALES
// orders + sales
// ===============================


export async function getSalesByRange(
  start:Date,
  end:Date
){


const {

data:orders,

error:orderError

}=await supabase

.from("orders")

.select(
`
id,
total,
created_at,
status,
payment_method
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






const {

data:sales,

error:salesError

}=await supabase

.from("sales")

.select(
`
id,
total,
created_at,
payment_method
`
)

.gte(
"created_at",
start.toISOString()
)

.lte(
"created_at",
end.toISOString()
);






if(orderError || salesError){


console.error(
"Error ventas",
orderError || salesError
);


return {

total:0,

count:0,

average:0

};


}





const allSales=[

...(orders || []),

...(sales || [])

];





const total =
allSales.reduce(

(sum,item)=>

sum + Number(item.total || 0),

0

);





const count =
allSales.length;





return {


total,

count,

average:

count

?

total/count

:

0


};


}









export async function getSalesToday(){

const now=new Date();


return getSalesByRange(

new Date(getStartOfDay(now)),

new Date(getEndOfDay(now))

);


}








export async function getSalesYesterday(){


const date=new Date();


date.setDate(
date.getDate()-1
);



return getSalesByRange(

new Date(getStartOfDay(date)),

new Date(getEndOfDay(date))

);


}









export async function getSalesThisWeek(){


const today=new Date();


const firstDay=new Date(today);


firstDay.setDate(

today.getDate()-today.getDay()

);




return getSalesByRange(

new Date(getStartOfDay(firstDay)),

new Date(getEndOfDay(today))

);


}









export async function getSalesThisMonth(){


const today=new Date();


const firstDay=new Date(

today.getFullYear(),

today.getMonth(),

1

);




return getSalesByRange(

new Date(getStartOfDay(firstDay)),

new Date(getEndOfDay(today))

);


}











// ===============================
// PRODUCTOS MAS VENDIDOS
// order_items + sale_items
// ===============================


export async function getTopProducts(
limit=10
){


const {

data:orderItems

}=await supabase

.from("order_items")

.select(
`
product_name,
quantity,
subtotal
`
);





const {

data:saleItems

}=await supabase

.from("sale_items")

.select(
`
product_name,
quantity,
subtotal
`
);






const items=[

...(orderItems || []),

...(saleItems || [])

];






const products:

Record<string,{

product_name:string;

quantity:number;

total:number;

}>

={};






items.forEach((item:any)=>{


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

b.quantity-a.quantity

)

.slice(
0,
limit
);



}











// ===============================
// PAGOS
// orders + sales
// ===============================


export async function getPaymentSummary(){



const {

data:orders

}=await supabase

.from("orders")

.select(
`
payment_method,
total,
status
`
)

.eq(
"status",
"ENTREGADO"
);






const {

data:sales

}=await supabase

.from("sales")

.select(
`
payment_method,
total
`
);






const payments:

Record<string,number>

={};






[

...(orders || []),

...(sales || [])

]

.forEach((item:any)=>{


const method =

item.payment_method || "OTRO";



payments[method]=

(

payments[method] || 0

)

+

Number(item.total || 0);



});






return Object.entries(payments)

.map(

([method,total])=>({

method,

total

})

);


}











// ===============================
// GRAFICA ULTIMOS DIAS
// orders + sales
// ===============================


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

0,
0,
0,
0

);







const {

data:orders

}=await supabase

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








const {

data:sales

}=await supabase

.from("sales")

.select(

"total,created_at"

)

.gte(

"created_at",

start.toISOString()

);








[

...(orders || []),

...(sales || [])

]

.forEach((item:any)=>{


const date =

new Date(item.created_at)

.toISOString()

.split("T")[0];





const row=

result.find(

x=>x.date===date

);





if(row){


row.total +=

Number(item.total || 0);


}


});






return result.map(item=>({

day:item.day,

total:item.total

}));



}