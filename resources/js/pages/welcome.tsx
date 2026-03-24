import { Head, usePage } from '@inertiajs/react';
import { CallToAction } from '@/components/welcome/cta';
import { FeaturesSection } from '@/components/welcome/feature-section';
import { Footer } from '@/components/welcome/footer';
import { Header } from '@/components/welcome/header';
import { HeroSection } from '@/components/welcome/hero';
import { HowItWorksSection } from '@/components/welcome/how-it-works-section';
import { PricingSection } from '@/components/welcome/pricing-section';
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
            <Head title="MYIA - Smart WhatsApp Business Communication" />
            <div className="min-h-screen">
                <Header canRegister={canRegister} auth={auth} t={t} />
                <main className="grow">
                    <HeroSection t={t} />
                    <FeaturesSection t={t} />
                    <HowItWorksSection t={t} />
                    <PricingSection t={t} />
                    <CallToAction t={t} />
                </main>
                <Footer t={t} />
            </div>
        </>
    );
}
