import { Link } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { register } from '@/routes';

interface DynamicPlan {
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

interface PricingSectionProps {
    t: TFunction;
    plans?: DynamicPlan[];
}

const formatPrice = (millicents: number): string => {
    return `$${(millicents / 100_000).toFixed(2)}`;
};

const calcYearlySavings = (monthly: number, yearly: number): number => {
    if (monthly <= 0 || yearly <= 0) return 0;
    const annualMonthly = monthly * 12;
    if (annualMonthly <= yearly) return 0;
    return Math.round(((annualMonthly - yearly) / annualMonthly) * 100);
};

const featureMeta: Record<string, { emoji: string; label: string; desc: string }> = {
    media_library: {
        emoji: '🖼️',
        label: 'Media Library',
        desc: 'Store and manage images, videos, and documents for your campaigns',
    },
    qualification_lead: {
        emoji: '🎯',
        label: 'Lead Qualification',
        desc: 'Automatically score and qualify leads based on conversation context',
    },
    faq: {
        emoji: '❓',
        label: 'FAQ',
        desc: 'Build and manage automated FAQ responses for common questions',
    },
    talk_from_lead: {
        emoji: '💬',
        label: 'Talk from Lead',
        desc: 'Initiate conversations directly from lead profiles',
    },
    reports: {
        emoji: '📊',
        label: 'Reports',
        desc: 'Access detailed reports on conversations, leads, and performance',
    },
    knowledge_base: {
        emoji: '📚',
        label: 'Knowledge Base',
        desc: 'Create a custom knowledge base for your AI agents to reference',
    },
    lead_export: {
        emoji: '📥',
        label: 'Lead Export',
        desc: 'Export your leads data to CSV or integrate with external tools',
    },
    agent_clone: {
        emoji: '🤖',
        label: 'Agent Clone',
        desc: 'Duplicate and customize existing AI agents for different use cases',
    },
    advanced_analytics: {
        emoji: '📈',
        label: 'Advanced Analytics',
        desc: 'Get advanced insights with custom dashboards and trend analysis',
    },
    custom_roles: {
        emoji: '👥',
        label: 'Custom Roles',
        desc: 'Define custom user roles and permissions for your team',
    },
    test_ia: {
        emoji: '🧪',
        label: 'Test IA',
        desc: 'Test and preview your AI agent responses before going live',
    },
};

const allFeatureKeys = [
    'media_library',
    'qualification_lead',
    'faq',
    'talk_from_lead',
    'reports',
    'knowledge_base',
    'lead_export',
    'agent_clone',
    'advanced_analytics',
    'custom_roles',
    'test_ia',
];

const limitsMeta: { key: string; emoji: string; label: string; format: (v: number) => string }[] = [
    { key: 'max_teams', emoji: '👥', label: 'Teams', format: (v) => String(v) },
    { key: 'max_members', emoji: '👤', label: 'Members', format: (v) => String(v) },
    { key: 'max_agents', emoji: '🤖', label: 'AI Agents', format: (v) => String(v) },
    { key: 'max_instances', emoji: '📱', label: 'WhatsApp Instances', format: (v) => String(v) },
];

const planIcons: Record<string, { icon: string; gradient: string }> = {
    free: { icon: '🚀', gradient: 'from-slate-500 to-gray-600' },
    pro: { icon: '⚡', gradient: 'from-purple-500 to-blue-600' },
    enterprise: { icon: '🏢', gradient: 'from-emerald-500 to-teal-600' },
};

export function PricingSection({ t, plans = [] }: PricingSectionProps) {
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

    const pricingPlans = plans.length > 0
        ? plans.map((plan, i) => {
            const monthlyPrice = plan.price_millicents;
            const yearlyPrice = plan.price_yearly_millicents ?? 0;
            const hasYearly = yearlyPrice > 0;
            const savings = hasYearly ? calcYearlySavings(monthlyPrice, yearlyPrice) : 0;
            const displayPrice = billingInterval === 'yearly' && hasYearly ? yearlyPrice : monthlyPrice;
            const perMonthPrice = hasYearly && billingInterval === 'yearly'
                ? yearlyPrice / 12
                : null;

            const defaultIcon = ['🚀', '⚡', '🏢'][i % 3];
            const defaultGrad = ['from-slate-500 to-gray-600', 'from-purple-500 to-blue-600', 'from-emerald-500 to-teal-600'][i % 3];
            const pi = planIcons[plan.slug] ?? { icon: defaultIcon, gradient: defaultGrad };

            return {
                type: plan.slug,
                name: plan.name,
                price: displayPrice === 0
                    ? t('welcome.pricing.free.price', 'Free')
                    : formatPrice(displayPrice),
                period: displayPrice > 0
                    ? (billingInterval === 'yearly' ? t('welcome.pricing.perYear', '/year') : t('welcome.pricing.perMonth', '/month'))
                    : undefined,
                perMonth: perMonthPrice !== null && perMonthPrice > 0
                    ? `${formatPrice(perMonthPrice)} ${t('welcome.pricing.perMonth', '/month')}`
                    : null,
                savings: savings > 0 ? savings : null,
                description: plan.description ?? '',
                features: plan.features ?? {},
                limits: { teams: plan.max_teams, members: plan.max_members, agents: plan.max_agents, instances: plan.max_instances },
                isPopular: i === 1,
                gradient: pi.gradient,
                icon: pi.icon,
            };
        })
        : [
        {
            type: 'free',
            name: t('welcome.pricing.free.name', 'Free'),
            price: t('welcome.pricing.free.price', 'Free'),
            description: t('welcome.pricing.free.description', 'Perfect for testing and small projects'),
            features: {
                media_library: true,
                qualification_lead: true,
                faq: true,
                talk_from_lead: true,
                reports: true,
                knowledge_base: false,
                lead_export: false,
                agent_clone: false,
                advanced_analytics: false,
                custom_roles: false,
                test_ia: false,
            },
            limits: { teams: 1, members: 5, agents: 1, instances: 1 },
            gradient: 'from-slate-500 to-gray-600',
            icon: '🚀',
            perMonth: null,
            savings: null,
        },
        {
            type: 'business',
            name: t('welcome.pricing.business.name', 'Business'),
            price: t('welcome.pricing.business.price', '€300'),
            period: t('welcome.pricing.business.period', 'month'),
            description: t('welcome.pricing.business.description', 'For growing businesses that need more power'),
            features: {
                media_library: true,
                qualification_lead: true,
                faq: true,
                talk_from_lead: true,
                reports: true,
                knowledge_base: true,
                lead_export: true,
                agent_clone: true,
                advanced_analytics: true,
                custom_roles: false,
                test_ia: true,
            },
            limits: { teams: 5, members: 20, agents: 10, instances: 5 },
            isPopular: true,
            gradient: 'from-purple-500 to-blue-600',
            icon: '⚡',
            perMonth: null,
            savings: null,
        },
        {
            type: 'contact',
            name: t('welcome.pricing.contact.name', 'Enterprise'),
            price: t('welcome.pricing.contact.price', 'Custom'),
            description: t('welcome.pricing.contact.description', 'For large organizations with advanced needs'),
            features: {
                media_library: true,
                qualification_lead: true,
                faq: true,
                talk_from_lead: true,
                reports: true,
                knowledge_base: true,
                lead_export: true,
                agent_clone: true,
                advanced_analytics: true,
                custom_roles: true,
                test_ia: true,
            },
            limits: { teams: 0, members: 0, agents: 0, instances: 0 },
            gradient: 'from-emerald-500 to-teal-600',
            icon: '🏢',
            perMonth: null,
            savings: null,
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
                    <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        {t('welcome.pricing.heading', 'Pricing')}
                    </h2>

                    <div className="inline-flex rounded-lg border p-0.5">
                        <button
                            type="button"
                            onClick={() => setBillingInterval('monthly')}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                billingInterval === 'monthly'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t('welcome.pricing.monthly', 'Monthly')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setBillingInterval('yearly')}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                billingInterval === 'yearly'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {t('welcome.pricing.yearly', 'Yearly')}
                        </button>
                    </div>
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

function formatLimit(value: number, label: string): string {
    if (value === 0) return `Unlimited ${label}`;
    return `${value} ${label}`;
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
        perMonth: string | null;
        savings: number | null;
        description: string;
        features: Record<string, boolean>;
        limits: { teams: number | null; members: number | null; agents: number | null; instances: number | null };
        isPopular?: boolean;
        gradient: string;
        icon: string;
    };
    t: TFunction;
}) {
    return (
        <div
            className={`relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 ${
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

            <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                </span>
                {plan.period && (
                    <span className="text-gray-500 dark:text-gray-400">
                        {plan.period}
                    </span>
                )}
            </div>

            {plan.perMonth && (
                <p className="mb-1 text-sm text-muted-foreground">
                    {plan.perMonth} {t('welcome.pricing.billedAnnually', 'billed annually')}
                </p>
            )}

            {plan.savings && (
                <div className="mb-6">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {t('welcome.pricing.savePercent', 'Save :percent%').replace(':percent', String(plan.savings))}
                    </span>
                </div>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
                {[
                    { value: plan.limits.instances, emoji: '📱', label: 'WhatsApp' },
                    { value: plan.limits.agents, emoji: '🤖', label: 'Agents' },
                    { value: plan.limits.members, emoji: '👤', label: 'Members' },
                    { value: plan.limits.teams, emoji: '👥', label: 'Teams' },
                ].map(({ value, emoji, label }) => {
                    if (value === null) return null;
                    const display = value === 0 ? '∞' : String(value);
                    return (
                        <span
                            key={label}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                            {emoji} {display} {label}
                        </span>
                    );
                })}
            </div>

            {plan.type === 'contact' ? (
                <Button className="mb-8 mt-auto w-full" variant="outline" asChild>
                    <Link href="#contact">
                        {t('welcome.pricing.contact.button', 'Contact Sales')}
                    </Link>
                </Button>
            ) : (
                <Button
                    className={`mb-8 mt-auto w-full ${
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

            <div className="border-t pt-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Features
                </p>
                <div className="space-y-3">
                    {allFeatureKeys.map((key) => {
                        const meta = featureMeta[key];
                        if (!meta) return null;
                        const enabled = plan.features[key] ?? false;
                        return (
                            <Tooltip key={key}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`flex cursor-help items-center gap-3 ${
                                            enabled ? '' : 'opacity-40'
                                        }`}
                                    >
                                        <span className="text-base">{meta.emoji}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {meta.label}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-64">
                                    <p className="text-xs">{meta.desc}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
