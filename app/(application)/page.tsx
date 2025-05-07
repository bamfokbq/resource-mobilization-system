import HealthStats from '@/components/chart_and_graphics/HealthStats';
import Assistance from '@/components/features/Assistance';
import Contributions from '@/components/features/Contributions';
import Features from '@/components/features/Features';
import LandingHero from '@/components/features/LandingHero';
import PartnersMap from '@/components/features/PartnersMap';
import ResourcesAction from '@/components/features/ResourcesAction';

export default function Home() {
  return (
    <main>
      <LandingHero />
      <Features />
      <PartnersMap />
      <Contributions />
      <HealthStats />
      <ResourcesAction />
      <Assistance />
    </main>
  );
}
