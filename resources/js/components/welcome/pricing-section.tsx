import { Link } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

interface PricingSectionProps {
    t: TFunction;
}

export function PricingSection({ t }: PricingSectionProps) {
    const pricingPlans = [
        {
            type: 'free',
            name: t('welcome.pricing.free.name', 'Free'),
            price: t('welcome.pricing.free.price', 'Free'),
            description: t(
                'welcome.pricing.free.description',
                'Perfect for testing and small projects',
            ),
            features: [
                t('welcome.pricing.free.features.0', '1 WhatsApp Instance'),
                t('welcome.pricing.free.features.1', '1 AI Agent'),
                t('welcome.pricing.free.features.2', '100 MB Storage'),
                t('welcome.pricing.free.features.3', 'Lead Management'),
                t('welcome.pricing.free.features.4', 'Basic Analytics'),
            ],
            gradient: 'from-slate-500 to-gray-600',
            icon: '🚀',
        },
        {
            type: 'business',
            name: t('welcome.pricing.business.name', 'Business'),
            price: t('welcome.pricing.business.price', '€300'),
            period: t('welcome.pricing.business.period', 'month'),
            description: t(
                'welcome.pricing.business.description',
                'For growing businesses that need more power',
            ),
            features: [
                t(
                    'welcome.pricing.business.features.0',
                    'Unlimited WhatsApp Instances',
                ),
                t('welcome.pricing.business.features.1', 'Unlimited AI Agents'),
                t('welcome.pricing.business.features.2', '10 GB Storage'),
                t(
                    'welcome.pricing.business.features.3',
                    'Multi-instance Management',
                ),
                t('welcome.pricing.business.features.4', 'Priority Support'),
                t(
                    'welcome.pricing.business.features.5',
                    'Custom Knowledge Base (RAG)',
                ),
                t('welcome.pricing.business.features.6', 'Advanced Analytics'),
                t('welcome.pricing.business.features.7', 'Campaign Management'),
            ],
            isPopular: true,
            gradient: 'from-purple-500 to-blue-600',
            icon: '⚡',
        },
        {
            type: 'contact',
            name: t('welcome.pricing.contact.name', 'Enterprise'),
            price: t('welcome.pricing.contact.price', 'Custom'),
            description: t(
                'welcome.pricing.contact.description',
                'For large organizations with advanced needs',
            ),
            features: [
                t(
                    'welcome.pricing.contact.features.0',
                    'Everything in Business',
                ),
                t('welcome.pricing.contact.features.1', 'Unlimited Storage'),
                t('welcome.pricing.contact.features.2', 'Dedicated Support'),
                t('welcome.pricing.contact.features.3', 'Custom Integrations'),
                t('welcome.pricing.contact.features.4', 'SLA Guarantee'),
                t('welcome.pricing.contact.features.5', 'On-premise Option'),
                t('welcome.pricing.contact.features.6', 'Custom Training'),
                t('welcome.pricing.contact.features.7', 'Account Manager'),
            ],
            gradient: 'from-emerald-500 to-teal-600',
            icon: '🏢',
        },
    ];

    return (
        <section
            id="pricing"
            className="bg-gradient-to-b from-gray-50 to-white px-6 py-24 dark:from-gray-900 dark:to-gray-800"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-1.5 text-sm font-semibold text-purple-700 dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300">
                        {t('welcome.pricing.title', 'PRICING')}
                    </span>
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        {t('welcome.pricing.heading', 'Pricing')}
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {pricingPlans.map((plan) => (
                        <PricingCard key={plan.type} plan={plan} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingCard({
    plan,
    t,
}: {
    plan: {
        type: string;
        name: string;
        price: string;
        period?: string;
        description: string;
        features: string[];
        isPopular?: boolean;
        gradient: string;
        icon: string;
    };
    t: TFunction;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 ${
                plan.isPopular
                    ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900'
                    : ''
            }`}
        >
            {plan.isPopular && (
                <div className="absolute top-6 -right-12 rotate-45 bg-gradient-to-r from-purple-500 to-blue-600 px-16 py-1 text-sm font-semibold text-white">
                    {t('welcome.pricing.business.popular', 'Popular')}
                </div>
            )}

            <div
                className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} shadow-lg`}
            >
                <span className="text-2xl">{plan.icon}</span>
            </div>

            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {plan.name}
            </h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {plan.description}
            </p>

            <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                </span>
                {plan.period && (
                    <span className="text-gray-500 dark:text-gray-400">
                        {' /'}
                        {plan.period}
                    </span>
                )}
            </div>

            {plan.type === 'contact' ? (
                <Button className="mb-8 w-full" variant="outline" asChild>
                    <Link href="#contact">
                        {t('welcome.pricing.contact.button', 'Contact Sales')}
                    </Link>
                </Button>
            ) : (
                <Button
                    className={`mb-8 w-full ${
                        plan.isPopular
                            ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700'
                            : ''
                    }`}
                    variant={plan.isPopular ? 'default' : 'outline'}
                    asChild
                >
                    <Link href={register()}>
                        {plan.isPopular
                            ? t('welcome.pricing.getStarted', 'Get Started')
                            : t('welcome.pricing.tryFree', 'Try Free')}
                    </Link>
                </Button>
            )}

            <div className="space-y-3">
                {plan.features.map((feature: string) => (
                    <div key={feature} className="flex items-start gap-3">
                        <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}
                        >
                            <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            {feature}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
