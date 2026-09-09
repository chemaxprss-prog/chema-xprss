"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode
} from "react";


export interface CartItem {

  id:number;

  name:string;

  size:string;

  price:number;

  quantity:number;

  notes?:string;

}



interface CartContextType {

  items:CartItem[];

  addItem:(item:CartItem)=>void;

  removeItem:(index:number)=>void;

  increaseItem:(index:number)=>void;

  decreaseItem:(index:number)=>void;

  clearCart:()=>void;

  total:number;

}



const CartContext = createContext<CartContextType | undefined>(undefined);



export function CartProvider({
  children
}:{
  children:ReactNode
}){


const [items,setItems]=useState<CartItem[]>([]);



function addItem(item:CartItem){


setItems((prev)=>{


const existing = prev.find(

(product)=>

product.id === item.id &&
product.size === item.size

);



if(existing){

return prev.map(product=>

product.id === item.id &&
product.size === item.size

?

{
...product,
quantity:product.quantity+item.quantity
}

:

product

);

}



return [

...prev,

item

];


});


}




function removeItem(index:number){


setItems((prev)=>

prev.filter((_,i)=>i!==index)

);


}




function increaseItem(index:number){


setItems((prev)=>

prev.map((item,i)=>

i===index

?

{
...item,
quantity:item.quantity+1
}

:

item

)

);


}




function decreaseItem(index:number){


setItems((prev)=>

prev.map((item,i)=>

i===index && item.quantity>1

?

{
...item,
quantity:item.quantity-1
}

:

item

)

);


}




function clearCart(){

setItems([]);

}





const total = items.reduce(

(sum,item)=>

sum + (item.price * item.quantity),

0

);



return (

<CartContext.Provider

value={{

items,

addItem,

removeItem,

increaseItem,

decreaseItem,

clearCart,

total

}}

>

{children}

</CartContext.Provider>

);


}





export function useCart(){


const context = useContext(CartContext);



if(!context){

throw new Error(
"useCart debe estar dentro de CartProvider"
);

}



return context;


}