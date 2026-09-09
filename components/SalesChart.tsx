"use client";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export default function SalesChart({
  data
}:{
  data:{
    day:string;
    total:number;
  }[]
}){


return (

<div className="bg-white rounded-xl shadow p-5">


<h2 className="text-xl font-bold mb-5">
📊 Ventas últimos días
</h2>


<div className="h-72">

<ResponsiveContainer
width="100%"
height="100%"
>

<BarChart data={data}>


<XAxis
dataKey="day"
/>


<YAxis />


<Tooltip />


<Bar
dataKey="total"
/>


</BarChart>


</ResponsiveContainer>


</div>


</div>

);


}