import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note App",
  description: "Notes App",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: "en" | "pt" };
}) {
  let lang: "pt-BR" | "en-US" = "pt-BR";
  if (params.lang === "en") {
    lang = "en-US";
  } else if (params.lang === "pt") {
    lang = "pt-BR";
  }
  return (
    <html lang={lang}>
      <body className={inter.className}>
        {children}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
