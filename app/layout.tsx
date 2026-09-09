import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// ESTA APP ES DINÁMICA
// No generar páginas estáticas durante build
export const dynamic = "force-dynamic";

export const revalidate = 0;


export const metadata: Metadata = {
  title: "Chema Xprss",
  description: "Pedidos online",
};


export default function RootLayout({

children,

}: Readonly<{

children: React.ReactNode;

}>) {


return (

<html

lang="es"

className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}

>

<body className="min-h-full flex flex-col">


<CartProvider>

{children}

</CartProvider>


</body>

</html>

);


}