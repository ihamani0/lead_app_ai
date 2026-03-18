import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FullWidthDivider } from '@/components/ui/full-width-divider';
import { useTranslation } from '@/hooks/use-translation';

type PricingPlan = {
    name: string;
    price: string;
    period?: string;
    description: string;
    href?: string;
    featuresTitle: string;
    features: string[];
    isPopular?: boolean;
};

export function PricingSection() {
    const { t } = useTranslation();

    const pricingPlans: PricingPlan[] = [
        {
            name: 'FREE TRIAL',
            price: t('welcome.pricing.free.price'),
            description: t('welcome.pricing.free.description'),
            featuresTitle: t('welcome.pricing.free.featuresTitle'),
            features: [
                t('welcome.pricing.free.features.0'),
                t('welcome.pricing.free.features.1'),
                t('welcome.pricing.free.features.2'),
                t('welcome.pricing.free.features.3'),
                t('welcome.pricing.free.features.4'),
            ],
            href: '/register',
        },
        {
            name: 'BUSINESS',
            isPopular: true,
            href: '/register',
            price: t('welcome.pricing.business.price'),
            period: t('welcome.pricing.business.period'),
            description: t('welcome.pricing.business.description'),
            featuresTitle: t('welcome.pricing.business.featuresTitle'),
            features: [
                t('welcome.pricing.business.features.0'),
                t('welcome.pricing.business.features.1'),
                t('welcome.pricing.business.features.2'),
                t('welcome.pricing.business.features.3'),
                t('welcome.pricing.business.features.4'),
                t('welcome.pricing.business.features.5'),
                t('welcome.pricing.business.features.6'),
                t('welcome.pricing.business.features.7'),
            ],
        },
    ];

    return (
        <section className="mx-auto min-h-screen max-w-6xl place-content-center border-x py-4">
            <div className="relative">
                <FullWidthDivider position="top" />
                <FullWidthDivider position="bottom" />

                <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col bg-background p-8 md:col-span-2">
                        <p className="mb-6 text-sm tracking-wider text-muted-foreground uppercase">
                            {t('welcome.pricing.title')}
                        </p>
                        <h1 className="text-3xl leading-tight font-bold md:text-5xl">
                            {t('welcome.pricing.heading')}
                        </h1>
                    </div>

                    {pricingPlans.map((plan) => (
                        <PricingCard key={plan.name} plan={plan} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col bg-background *:px-4 *:py-6">
            <div className="border-b">
                <p className="mb-6 text-sm tracking-wider text-muted-foreground uppercase">
                    {plan.name}
                </p>
                <div className="mb-2 flex items-baseline gap-2">
                    <h2 className="text-4xl font-bold">{plan.price}</h2>
                    {plan.period && (
                        <span className="text-xs text-muted-foreground">
                            / {plan.period}
                        </span>
                    )}
                </div>
                <p className="mb-8 line-clamp-1 text-muted-foreground">
                    {plan.description}
                </p>

                <Button
                    className="w-full"
                    variant={plan.isPopular ? 'default' : 'outline'}
                    asChild={plan.href !== '#'}
                >
                    <a href={plan.href}>
                        {plan.isPopular
                            ? t('welcome.pricing.getStarted')
                            : t('welcome.pricing.tryFree')}
                    </a>
                </Button>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
                <p className="mb-6 text-xs uppercase">{plan.featuresTitle}</p>

                {plan.features.map((feature) => (
                    <p
                        className="flex items-center gap-2 text-foreground/80"
                        key={feature}
                    >
                        <CheckIcon className="size-4" />
                        {feature}
                    </p>
                ))}
            </div>
        </div>
    );
}
