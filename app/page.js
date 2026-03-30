
import GinnieHero from "@/components/GinnieHero";
import SafetyZone from "@/components/SafetyZone";
import Storyboard from "@/components/Storyboard";
import ThemeSelector from "@/components/ThemeSelector";

export default function Home() {
  return (
    <main className=" overflow-x-hidden">
      <GinnieHero />
      <SafetyZone/>
      <Storyboard/>
      <ThemeSelector/>

      
    </main>
  );
}