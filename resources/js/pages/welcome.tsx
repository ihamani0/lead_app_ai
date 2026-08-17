import { Head, usePage } from '@inertiajs/react';
import { CallToAction } from '@/components/welcome/cta';
import { FeaturesSection } from '@/components/welcome/feature-section';
import { Footer } from '@/components/welcome/footer';
import { Header } from '@/components/welcome/header';
import { HeroSection } from '@/components/welcome/hero';
import { HowItWorksSection } from '@/components/welcome/how-it-works-section';
import { PricingSection } from '@/components/welcome/pricing-section';
import { useTranslation } from '@/hooks/use-translation';

interface Plan {
    name: string;
    slug: string;
    price_millicents: number;
    price_yearly_millicents: number | null;
    description: string | null;
    features: Record<string, boolean> | null;
    max_teams: number | null;
    max_members: number | null;
    max_leads: number | null;
    max_agents: number | null;
    max_instances: number | null;
}

export default function Welcome({
    canRegister = true,
    plans = [],
}: {
    canRegister?: boolean;
    plans?: Plan[];
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
                    <PricingSection t={t} plans={plans} />
                    <CallToAction t={t} />
                </main>
                <Footer t={t} />
            </div>
        </>
    );
}
