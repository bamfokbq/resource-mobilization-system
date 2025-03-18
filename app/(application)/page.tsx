import HealthStats from '@/components/chart_and_graphics/HealthStats';
import NcdStats from '@/components/chart_and_graphics/NcdStats';
import Assistance from '@/components/features/Assistance';
import Contributions from '@/components/features/Contributions';
import Features from '@/components/features/Features';
import LandingHero from '@/components/features/LandingHero';
import ResourcesAction from '@/components/features/ResourcesAction';

export default function Home() {
  return (
    <main>
      <LandingHero />
      <Features />
      <Contributions />
      <NcdStats />
      <HealthStats />
      <ResourcesAction />
      <Assistance />
    </main>
  );
}
