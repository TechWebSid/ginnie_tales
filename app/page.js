
import GinnieHero from "@/components/GinnieHero";
import SafetyZone from "@/components/SafetyZone";
import ThemeSelector from "@/components/ThemeSelector";

export default function Home() {
  return (
    <main className=" overflow-x-hidden">
      <GinnieHero />
      <SafetyZone/>
      <ThemeSelector/>

      
    </main>
  );
}