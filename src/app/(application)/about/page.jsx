import AboutUsSection from "@/components/about/AboutUsSection";
import TeamSection from "@/components/home/index/bartar";
import ArcStory from "@/components/about/ArcStory";
import TeachersSection from "@/components/home/index/Teacher";

export default function About() {


  return (
    <div className="items-center min-h-screen font-kalameh">
      <AboutUsSection />
      {/* <ArcStory /> */}
      <TeachersSection />
    </div>
  );
}


