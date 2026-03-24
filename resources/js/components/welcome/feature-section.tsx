'use client';

import type { TFunction } from 'i18next';
import { MessageSquare, Bot, Users, Brain, BarChart3 } from 'lucide-react';

interface FeaturesSectionProps {
    t: TFunction;
}

export function FeaturesSection({ t }: FeaturesSectionProps) {
    const features = [
        {
            icon: MessageSquare,
            titleKey: 'welcome.features.whatsapp-integration.title',
            title: 'WhatsApp Integration',
            descKey: 'welcome.features.whatsapp-integration.description',
            desc: 'Connect multiple WhatsApp instances seamlessly with Evolution API',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            icon: Bot,
            titleKey: 'welcome.features.ai-agents.title',
            title: 'AI Agents',
            descKey: 'welcome.features.ai-agents.description',
            desc: 'Deploy AI agents to handle customer conversations 24/7',
            color: 'from-purple-500 to-indigo-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
        {
            icon: Users,
            titleKey: 'welcome.features.lead-management.title',
            title: 'Lead Management',
            descKey: 'welcome.features.lead-management.description',
            desc: 'Capture, qualify, and nurture leads automatically',
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            icon: BarChart3,
            titleKey: 'welcome.features.analytics.title',
            title: 'Analytics',
            descKey: 'welcome.features.analytics.description',
            desc: 'Get detailed insights with real-time dashboards and custom reports',
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        },
        {
            icon: Brain,
            titleKey: 'welcome.features.rag.title',
            title: 'RAG',
            descKey: 'welcome.features.rag.description',
            desc: 'Connect your AI agents to your business knowledge base',
            color: 'from-violet-500 to-purple-600',
            bgColor: 'bg-violet-50 dark:bg-violet-950/30',
        },
    ];

    return (
        <section id="features" className="bg-white px-6 py-24 dark:bg-gray-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        {t('welcome.features.title', 'Powerful Features')}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                        {t(
                            'welcome.features.subtitle',
                            'Everything you need to automate your business communications and grow your customer base',
                        )}
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.titleKey}
                                className={`group relative overflow-hidden rounded-2xl ${feature.bgColor} p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                            >
                                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 transition-transform duration-300 group-hover:scale-150" />

                                <div
                                    className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg shadow-purple-500/20`}
                                >
                                    <Icon className="h-7 w-7 text-white" />
                                </div>

                                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                                    {t(feature.titleKey, feature.title)}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {t(feature.descKey, feature.desc)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
