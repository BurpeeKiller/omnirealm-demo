import HeroSection from '@/components/HeroSection';
import ProblemSolutionSection from '@/components/ProblemSolutionSection';
import EngagementsSection from '@/components/EngagementsSection';
import ProductsSection from '@/components/ProductsSection';
import CallToActionSection from '@/components/CallToActionSection';
import SocialShareSection from '@/components/SocialShareSection';
import FooterSection from '@/components/FooterSection';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <ProblemSolutionSection />
        <EngagementsSection />
        <ProductsSection />
        <CallToActionSection />
        <SocialShareSection />
      </main>
      <FooterSection />
    </div>
  );
}
