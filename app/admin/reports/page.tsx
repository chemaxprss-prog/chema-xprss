import {
  getSalesToday,
  getSalesYesterday,
  getSalesThisWeek,
  getSalesThisMonth,
  getTopProducts,
  getPaymentSummary,
  getSalesLastDays,
} from "@/lib/reports";

import SalesChart from "@/components/SalesChart";



export default async function ReportsPage() {


  const [
    today,
    yesterday,
    week,
    month,
    products,
    payments,
    salesChart,

  ] = await Promise.all([


    getSalesToday(),

    getSalesYesterday(),

    getSalesThisWeek(),

    getSalesThisMonth(),

    getTopProducts(),

    getPaymentSummary(),

    getSalesLastDays(),


  ]);




  return (

    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">


      <div>

        <h1 className="text-3xl font-black text-gray-800">

          📈 Reportes

        </h1>


        <p className="text-gray-500 mt-1">

          Resumen del rendimiento del negocio

        </p>


      </div>





      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">



        <ReportCard

          icon="💰"

          title="Ventas Hoy"

          value={today.total}

          subtitle={`${today.count} ventas`}

          extra={`Ticket promedio $${today.average.toFixed(2)}`}

        />



        <ReportCard

          icon="📅"

          title="Ventas Ayer"

          value={yesterday.total}

          subtitle={`${yesterday.count} ventas`}

          extra={`Ticket promedio $${yesterday.average.toFixed(2)}`}

        />




        <ReportCard

          icon="📊"

          title="Esta Semana"

          value={week.total}

          subtitle={`${week.count} ventas`}

          extra={`Ticket promedio $${week.average.toFixed(2)}`}

        />




        <ReportCard

          icon="🚀"

          title="Este Mes"

          value={month.total}

          subtitle={`${month.count} ventas`}

          extra={`Ticket promedio $${month.average.toFixed(2)}`}

        />



      </div>





      <SalesChart data={salesChart} />







      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">





        <section className="bg-white rounded-3xl shadow-sm p-6">


          <h2 className="text-xl font-black text-gray-800 mb-5">

            🏆 Productos más vendidos

          </h2>




          <div className="space-y-4">


            {products.map((product,index)=>(


              <div

                key={product.product_name}

                className="
                flex
                justify-between
                items-center
                bg-gray-50
                rounded-2xl
                p-4
                "

              >



                <div className="flex items-center gap-3">


                  <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-orange-100
                  flex
                  items-center
                  justify-center
                  font-black
                  text-orange-600
                  ">

                    {index + 1}

                  </div>




                  <div>


                    <p className="font-bold text-gray-800">

                      {product.product_name}

                    </p>


                    <p className="text-sm text-gray-500">

                      {product.quantity} unidades vendidas

                    </p>


                  </div>


                </div>




                <div className="font-black text-teal-600">

                  ${product.total.toFixed(2)}

                </div>



              </div>


            ))}


          </div>



        </section>








        <section className="bg-white rounded-3xl shadow-sm p-6">


          <h2 className="text-xl font-black text-gray-800 mb-5">

            💳 Métodos de pago

          </h2>




          <div className="space-y-4">


            {payments.map((payment)=>(



              <div

                key={payment.method}

                className="
                flex
                justify-between
                items-center
                bg-gray-50
                rounded-2xl
                p-4
                "

              >



                <div className="flex items-center gap-3">


                  <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-teal-100
                  flex
                  items-center
                  justify-center
                  ">

                    💵

                  </div>


                  <span className="font-bold text-gray-700">

                    {payment.method}

                  </span>


                </div>




                <span className="font-black text-orange-600">

                  ${payment.total.toFixed(2)}

                </span>



              </div>


            ))}


          </div>



        </section>



      </div>




    </div>

  );


}







function ReportCard({

  icon,

  title,

  value,

  subtitle,

  extra,

}:{

  icon:string;

  title:string;

  value:number;

  subtitle:string;

  extra:string;

}){


  return (

    <div className="
    bg-white
    rounded-3xl
    shadow-sm
    p-5
    border
    border-gray-100
    ">


      <div className="flex justify-between items-start">


        <div>


          <p className="text-sm text-gray-500 font-bold">

            {title}

          </p>


          <p className="
          text-3xl
          font-black
          text-gray-800
          mt-2
          ">

            ${value.toFixed(2)}

          </p>


        </div>



        <div className="
        text-3xl
        bg-orange-50
        rounded-2xl
        p-3
        ">

          {icon}

        </div>



      </div>




      <div className="mt-4 space-y-1">


        <p className="text-sm font-bold text-teal-600">

          {subtitle}

        </p>


        <p className="text-xs text-gray-500">

          {extra}

        </p>



      </div>



    </div>

  );


}