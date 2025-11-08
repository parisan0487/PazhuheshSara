
import TeamSection from "@/components/home/index/Honarvar";
import Counseling from "@/components/home/index/Counseling";
import FeatureBox from "@/components/home/index/FeatureBox";
import Header from "@/components/home/index/Header";
import ProjectsSection from "@/components/home/index/ResearchHallGallery";
import TeachersSection from "@/components/home/index/Teacher";


export default function Home() {
  return (
    <div className="items-center min-h-screen">
      <Header />
      <FeatureBox />
      <ProjectsSection />
      <Counseling />
      <TeamSection />
      <TeachersSection />
    </div>
  );
}
