import "./globals.css";
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "پژوهش سرای کاشمر",
  description: "پژوهش سرا کاشمر نوبت دهی",
  icons: {
    icon: "/img/logo.jpg", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" >
      <body
        className={`antialiased`} suppressHydrationWarning
      >
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
