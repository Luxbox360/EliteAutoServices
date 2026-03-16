import AboutHero from './AboutHero';
import AboutContent from './AboutContent';
import WhyChooseUs from './WhyChooseUs';
import ContactCTA from './ContactCTA';

interface AboutPageProps {
  onContact: () => void;
}

export default function AboutPage({ onContact }: AboutPageProps) {
  return (
    <>
      <main>
        <AboutHero />
        <AboutContent />
        <WhyChooseUs />
        <ContactCTA onContact={onContact} />
      </main>
    </>
  );
}