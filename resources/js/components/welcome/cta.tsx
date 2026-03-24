import { Link } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

interface CallToActionProps {
    t: TFunction;
}

export function CallToAction({ t }: CallToActionProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 px-6 py-20 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl" />
                <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-4xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl dark:text-white">
                    {t('welcome.cta.title', 'Ready to Get Started?')}
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                    {t(
                        'welcome.cta.description',
                        'Join thousands of businesses already using MYIA to automate their WhatsApp communications.',
                    )}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
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
                </div>
            </div>
        </section>
    );
}
