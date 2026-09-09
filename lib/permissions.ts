export const permissions = {


  superadmin:[

    "dashboard",
    "users",
    "orders",
    "kitchen",
    "pos",
    "products",
    "categories",
    "customers",
    "reports",
    "settings"

  ],



  admin:[

    "dashboard",
    "orders",
    "kitchen",
    "pos",
    "products",
    "customers",
    "reports"

  ],



  cajero:[

    "dashboard",
    "orders",
    "pos",
    "customers"

  ],



  cocina:[

    "dashboard",
    "kitchen"

  ]


};




export function canAccess(

  role:string,

  section:string

){


return permissions[

  role as keyof typeof permissions

]?.includes(section);


}