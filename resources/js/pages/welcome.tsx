import { Head, usePage } from '@inertiajs/react';
import BrandShowcase from '@/components/welcome/brand-showcase';
import { CallToAction } from '@/components/welcome/cta';
import { FaqsSection } from '@/components/welcome/faqs-section';
import { FeaturesSection } from '@/components/welcome/feature-section';
import { Footer } from '@/components/welcome/footer';
import { Header } from '@/components/welcome/header';
import { HeroSection } from '@/components/welcome/hero';
import { HowItWorksSection } from '@/components/welcome/how-it-works-section';
import { PricingSection } from '@/components/welcome/pricing-section';
import { TestimonialsSection } from '@/components/welcome/testimonials-section';
import { useTranslation } from '@/hooks/use-translation';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    return (
        <>
            <Head title="Crew AI SaaS - Smart Business Communication" />
            <div className="min-h-screen">
                {/* NavBar */}
                <Header canRegister={canRegister} auth={auth} t={t} />
                <main className="grow">
                    <HeroSection t={t} auth={auth} />

                    {/* <FeaturesSection t={t} />
                    <HowItWorksSection t={t} />
                    <PricingSection />
                    <TestimonialsSection />
                    <CallToAction />

                    <FaqsSection />

                    <BrandShowcase brandName="CREW" /> */}
                </main>
                <Footer />
            </div>
        </>
    );
}
