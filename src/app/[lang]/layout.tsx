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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: "pt" | "en" }>;
}) {
  const { lang } = await params;
  let formatLang: "pt-BR" | "en-US" = "pt-BR";
  if (lang === "en") {
    formatLang = "en-US";
  } else if (lang === "pt") {
    formatLang = "pt-BR";
  }

  return (
    <html lang={formatLang}>
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
