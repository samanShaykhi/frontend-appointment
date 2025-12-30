import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { ContextProvider } from "@/components/utils/context/Index";
import NextTopLoader from "nextjs-toploader";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "نوبت دهی آنلاین",
  description: "مرجع اصلی نوبت دهی ایران",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className={inter.className}>
        <ContextProvider>
          <NextTopLoader
            color="#2563eb"     // رنگ نوار
            height={4}          // ضخامت نوار
            showSpinner={false} // اگر true باشه spinner هم نشون می‌ده
          />
          {children}
        </ContextProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
