
import TeamSection from "@/components/home/index/bartar";
import BlogSection from "@/components/home/index/BlogSection";
import Counseling from "@/components/home/index/Counseling";
import FeatureBox from "@/components/home/index/FeatureBox";
import Header from "@/components/home/index/Header";
import ProjectsSection from "@/components/home/index/ResearchHallGallery";
import ServicesSection from "@/components/home/index/ServicesSection";


export default function Home() {
  return (
    <div className="items-center min-h-screen">
      <Header />
      <FeatureBox />
      {/* <ServicesSection /> */}
      <ProjectsSection />
      <Counseling />
      {/* <BlogSection /> */}
      <TeamSection />
    </div>
  );
}
