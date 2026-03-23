import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TFunction } from 'i18next';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';
import type { Auth } from '@/types';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const floatAnim = {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

export function HeroSection({ t, auth }: { t: TFunction; auth: Auth }) {
    return (
        <section className="relative h-screen overflow-hidden px-6 pt-24 pb-20 text-center">
            {/* Soft background blob */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="relative z-10"
            >
                <motion.div
                    variants={fadeUp}
                    className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-[13px] font-medium text-primary"
                >
                    AI-Powered WhatsApp Automation
                </motion.div>

                <motion.h1
                    variants={fadeUp}
                    className="mx-auto mb-5  text-[clamp(2.8rem,6vw,4.4rem)] leading-[1.1] text-foreground"
                >
                    Automate Your WhatsApp
                    <br />
                    Business with <em className="italic">Intelligent</em>
                    <br />
                    AI Agents
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    className="mx-auto mb-10 max-w-[480px]  text-lg leading-relaxed text-muted-foreground"
                >
                    Connect WhatsApp, deploy AI agents, and manage leads
                    automatically. Scale your business without increasing
                    headcount.
                </motion.p>

                <motion.div
                    variants={fadeUp}
                    className="flex flex-wrap justify-center gap-3"
                >
                    <Button
                        asChild
                        className="h-12 rounded-full px-8 text-[15px] font-semibold"
                    >
                        <Link href={register()}>Get Started — It's Free</Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-12 rounded-full px-8 text-[15px] font-semibold text-primary hover:bg-primary/5"
                    >
                        Watch Demo
                    </Button>
                </motion.div>
            </motion.div>

            {/* Dashboard Mockup Visual */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto mt-16 max-w-[780px]"
            >
                {/* <motion.div
                    animate={floatAnim}
                    className="rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-primary/10"
                >
                    <img
                        src="https://via.placeholder.com/780x400?text=Dashboard+Preview"
                        alt="App Preview"
                        className="w-full rounded-xl border border-border bg-muted/50 object-cover"
                    />
                </motion.div> */}
            </motion.div>
        </section>
    );
}
