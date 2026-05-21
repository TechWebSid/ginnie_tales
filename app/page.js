
import GinnieHero from "@/components/GinnieHero";
import MagicalCursor from "@/components/MagicalCursor";
import SafetyZone from "@/components/SafetyZone";
import Storyboard from "@/components/Storyboard";
import ThemeSelector from "@/components/ThemeSelector";

export default function Home() {
  return (
    <main className=" overflow-x-hidden">
      <MagicalCursor/>
      <GinnieHero />
      <SafetyZone/>
      <Storyboard/>
      <ThemeSelector/>
  

      
    </main>
  );
}