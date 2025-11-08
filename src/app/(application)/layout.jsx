import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navigation/Navbar";


export default function ApplicationLayout({ children }) {
  return (
    <div className="max-w-[1440px] min-w-[300px] mx-auto">
      <div className="px-3.5 p-5">
      <Navbar />
      {children}
      </div>
      <Footer />
    </div>
  );
}


