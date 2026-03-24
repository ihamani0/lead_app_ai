import { Link } from '@inertiajs/react';
import { motion, type Variants } from 'framer-motion';
import type { TFunction } from 'i18next';
import { ArrowRight, MessageCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

interface HeroSectionProps {
    t: TFunction;
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

export function HeroSection({ t }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/50 to-white px-6 pt-28 pb-20 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-700/20" />
                <div className="absolute -top-20 -right-40 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-700/20" />
                <div className="absolute -bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-700/20" />
            </div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="relative z-10 mx-auto max-w-4xl text-center"
            >
                <motion.div variants={fadeUp} className="mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        <Zap className="h-4 w-4" />
                        {t(
                            'welcome.subtitle',
                            'AI-Powered WhatsApp Business Platform',
                        )}
                    </span>
                </motion.div>

                <motion.h1
                    variants={fadeUp}
                    className="mb-6 text-5xl leading-tight font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl dark:text-white"
                >
                    {t(
                        'welcome.title',
                        'Automate Your WhatsApp Business with Intelligent AI Agents',
                    )}
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
                >
                    {t(
                        'welcome.description',
                        'Connect WhatsApp, deploy AI agents, and manage leads automatically. Scale your business communication without increasing headcount.',
                    )}
                </motion.p>

                <motion.div
                    variants={fadeUp}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <Button
                        asChild
                        size="lg"
                        className="h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-blue-700"
                    >
                        <Link href={register()}>
                            {t('welcome.buttonStarted', 'Get Started')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 rounded-full border-2 px-8 text-base font-semibold"
                    >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {t('welcome.hero.watchDemo', 'Watch Demo')}
                    </Button>
                </motion.div>
            </motion.div>

            {/* <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-10 mx-auto mt-16 max-w-5xl"
            >
                <div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-2xl shadow-purple-500/10 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/80">
                    <div className="flex items-center gap-2 border-b border-gray-200/50 bg-gray-50/80 px-4 py-3 dark:border-gray-700/50 dark:bg-gray-800/50">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950/30">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
                                <MessageCircle className="h-10 w-10 text-white" />
                            </div>
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                {t(
                                    'welcome.hero.dashboardPreview',
                                    'Dashboard Preview',
                                )}
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                {t(
                                    'welcome.hero.dashboardSubtitle',
                                    'Your AI-powered WhatsApp command center',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div> */}
        </section>
    );
}
