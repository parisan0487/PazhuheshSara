import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navigation/Navbar";
import ParticlesBackground from "@/ui/ParticlesBackground";


export default function ApplicationLayout({ children }) {
  return (
    <div className="max-w-[1440px] min-w-[300px] mx-auto">
      <div className="px-3.5 p-5">
      {/* <ParticlesBackground /> */}
      <Navbar />
      {children}
      </div>
      <Footer />
    </div>
  );
}


