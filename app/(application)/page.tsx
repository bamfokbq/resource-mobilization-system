import HealthStats from '@/components/chart_and_graphics/HealthStats';
import StakeholdersByRegionMap from '@/components/chart_and_graphics/StakeholdersByRegionMap';
// import Assistance from '@/components/features/Assistance';
import Contributions from '@/components/features/Contributions';
import Features from '@/components/features/Features';
import LandingHero from '@/components/features/LandingHero';
import PartnersMap from '@/components/features/PartnersMap';
import ResourcesAction from '@/components/features/ResourcesAction';
// import Stakeholders from '@/components/features/Stakeholders';

export default function Home() {
  return (
    <main>
      <LandingHero />
      {/* <Stakeholders /> */}
      <StakeholdersByRegionMap />
      <PartnersMap />
      {/* <HealthStats /> */}
      <Contributions />
      {/* <ResourcesAction /> */}
      {/* <Assistance /> */}
    </main>
  );
}
