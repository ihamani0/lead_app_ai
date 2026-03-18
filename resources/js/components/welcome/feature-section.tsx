'use client';

import type { TFunction } from 'i18next';
import { MessageSquare, Bot, Users, Brain, BarChart3 } from 'lucide-react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';

// Animated background components for visual interest
const WhatsAppBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-emerald-50 dark:bg-emerald-950/30">
        <div className="relative h-full w-full">
            {/* Mock phone interface */}
            <div className="absolute top-5 left-1/2 h-[400px] w-[280px] -translate-x-1/2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex h-12 items-center gap-3 bg-emerald-600 px-4">
                    <div className="h-8 w-8 rounded-full bg-white/20" />
                    <div className="flex-1">
                        <div className="h-3 w-24 rounded bg-white/90" />
                        <div className="mt-1 h-2 w-16 rounded bg-white/60" />
                    </div>
                </div>
                <div className="space-y-2 bg-neutral-100 p-3 dark:bg-neutral-800/50">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-xl px-3 py-2 ${
                                    i % 2 === 0
                                        ? 'bg-white shadow-sm dark:bg-neutral-700'
                                        : 'bg-emerald-500 text-white'
                                }`}
                            >
                                <div
                                    className={`h-2 w-20 rounded ${i % 2 === 0 ? 'bg-neutral-300 dark:bg-neutral-500' : 'bg-white/40'}`}
                                />
                                {i === 0 && (
                                    <div className="mt-1 h-2 w-28 rounded bg-neutral-300 dark:bg-neutral-500" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Floating connection lines */}
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 400"
            >
                <defs>
                    <linearGradient
                        id="line-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor="rgb(16, 185, 129)"
                            stopOpacity="0.6"
                        />
                        <stop
                            offset="100%"
                            stopColor="rgb(16, 185, 129)"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>
                <path
                    d="M50 200 Q150 150 200 200"
                    stroke="url(#line-gradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                />
                <path
                    d="M350 200 Q250 250 200 200"
                    stroke="url(#line-gradient)"
                    strokeWidth="2"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                />
            </svg>
        </div>
    </div>
);

const AIAgentBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="relative -mt-16 flex h-40 w-40 items-center justify-center">
            {/* Center brain icon */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-blue-400/50 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 shadow-lg shadow-blue-500/20 dark:border-blue-500/30">
                <Bot className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                {/* Orbiting dots */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="absolute h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 60}deg) translateX(48px) translateY(-50%)`,
                        }}
                    >
                        <div
                            className="h-full w-full animate-ping rounded-full bg-blue-400/60"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    </div>
                ))}
            </div>
            {/* Connection lines */}
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 160 160"
            >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line
                        key={i}
                        x1="80"
                        y1="80"
                        x2={80 + Math.cos((i * 60 * Math.PI) / 180) * 55}
                        y2={80 + Math.sin((i * 60 * Math.PI) / 180) * 55}
                        className="stroke-blue-400/50 dark:stroke-blue-500/40"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />
                ))}
            </svg>
        </div>
    </div>
);

const LeadManagementBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* CRM Dashboard mock - centered */}
        <div className="-mt-16 w-full max-w-[300px] px-4">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                {/* Header with stats */}
                <div className="grid grid-cols-3 gap-2 border-b border-neutral-200 p-3 dark:border-neutral-700">
                    {[
                        { label: 'Leads', value: '2,847' },
                        { label: 'Qualified', value: '1,234' },
                        { label: 'Converted', value: '567' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                {stat.value}
                            </div>
                            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Lead list */}
                <div className="space-y-1.5 p-2">
                    {[
                        { name: 'John D.', status: 'Hot', color: 'bg-red-500' },
                        {
                            name: 'Sarah M.',
                            status: 'Warm',
                            color: 'bg-amber-500',
                        },
                        {
                            name: 'Mike R.',
                            status: 'New',
                            color: 'bg-blue-500',
                        },
                    ].map((lead) => (
                        <div
                            key={lead.name}
                            className="flex items-center gap-2 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800/50"
                        >
                            <div className="h-6 w-6 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                            <div className="flex-1">
                                <div className="text-xs text-neutral-900 dark:text-neutral-100">
                                    {lead.name}
                                </div>
                            </div>
                            <span
                                className={`rounded px-2 py-0.5 text-[9px] text-white ${lead.color}`}
                            >
                                {lead.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const SystemRagBackground = () => (
    <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-12">
        <div className="relative flex flex-col items-center gap-6">
            {/* Document/Knowledge base visualization */}
            <div className="flex items-center gap-6">
                {/* Stacked documents */}
                <div className="relative h-28 w-20">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-1/2 left-1/2 h-24 w-16 rounded-lg border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-800"
                            style={{
                                transform: `translate(-50%, -50%) rotate(${(i - 1) * 8}deg)`,
                                zIndex: 3 - i,
                            }}
                        >
                            <div className="space-y-1 p-2">
                                <div className="h-1 w-full rounded bg-neutral-300 dark:bg-neutral-600" />
                                <div className="h-1 w-3/4 rounded bg-neutral-300 dark:bg-neutral-600" />
                                <div className="h-1 w-1/2 rounded bg-neutral-300 dark:bg-neutral-600" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Arrow */}
                <div className="flex items-center">
                    <div className="h-0.5 w-10 bg-gradient-to-r from-violet-500 to-blue-500" />
                    <div className="h-0 w-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-blue-500" />
                </div>
                {/* Brain/Model */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-violet-400/50 bg-gradient-to-br from-violet-500/30 to-blue-500/30 shadow-lg shadow-violet-500/20 dark:border-violet-500/30">
                    <Brain className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
            </div>
            {/* Floating data particles - contained within parent */}
            <div className="pointer-events-none absolute inset-0">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="absolute h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500/70 dark:bg-violet-400/60"
                        style={{
                            top: `${15 + i * 15}%`,
                            left: `${20 + i * 12}%`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    </div>
);

const ReportBackground = () => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-cyan-50 dark:bg-cyan-950/20">
        <div className="-mt-12 w-full max-w-[280px] px-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                {/* Mini chart header */}
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        Analytics
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <svg
                            className="h-3 w-3"
                            viewBox="0 0 12 12"
                            fill="none"
                        >
                            <path
                                d="M6 9V3M6 3L3 6M6 3L9 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-[10px] font-medium">24%</span>
                    </div>
                </div>
                {/* Bar chart */}
                <div className="mb-3 flex h-24 items-end justify-between gap-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <div
                            key={i}
                            className="flex flex-1 flex-col items-center gap-1"
                        >
                            <div
                                className="w-full rounded-t bg-linear-to-t from-cyan-500 to-cyan-400 transition-all duration-500 dark:from-cyan-600 dark:to-cyan-500"
                                style={{ height: `${height}%` }}
                            />
                            <span className="text-[8px] text-neutral-400">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                            </span>
                        </div>
                    ))}
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-700">
                    {[
                        { label: 'Views', value: '12.5K' },
                        { label: 'Clicks', value: '3.2K' },
                        { label: 'Conv.', value: '8.4%' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                {stat.value}
                            </div>
                            <div className="text-[9px] text-neutral-500 dark:text-neutral-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export function FeaturesSection({ t }: { t: TFunction }) {
    const features = [
        {
            Icon: MessageSquare,
            name: t('welcome.features.whatsapp-integration.title'),
            description: t('welcome.features.whatsapp-integration.description'),
            href: '#',
            cta: 'Learn more',
            background: <WhatsAppBackground />,
            className:
                'lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2',
        },
        {
            Icon: Bot,
            name: t('welcome.features.ai-agents.title'),
            description: t('welcome.features.ai-agents.description'),
            href: '#',
            cta: 'Learn more',
            background: <AIAgentBackground />,
            className:
                'lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-4',
        },
        {
            Icon: Users,
            name: t('welcome.features.lead-management.title'),
            description: t('welcome.features.lead-management.description'),
            href: '#',
            cta: 'Learn more',
            background: <LeadManagementBackground />,
            className:
                'lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3',
        },
        {
            Icon: Brain,
            name: t('welcome.features.rag.title'),
            description: t('welcome.features.rag.description'),
            href: '#',
            cta: 'Learn more',
            background: <SystemRagBackground />,
            className:
                'lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3',
        },
        {
            Icon: BarChart3,
            name: t('welcome.features.analytics.title'),
            description: t('welcome.features.analytics.description'),
            href: '#',
            cta: 'Learn more',
            background: <ReportBackground />,
            className:
                'lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4',
        },
    ];

    return (
        <section className="bg-background px-4 py-20">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {t('welcome.features.title')}
                    </h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        {t('welcome.features.subtitle')}
                    </p>
                </div>
                <BentoGrid className="auto-rows-[22rem] lg:grid-cols-3 lg:grid-rows-4">
                    {features.map((feature) => (
                        <BentoCard key={feature.name} {...feature} />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
