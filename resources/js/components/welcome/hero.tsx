import { Link } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import { ArrowRightIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';
import { dashboard, register } from '@/routes';
import type { Auth } from '@/types';

export function HeroSection({ t, auth }: { t: TFunction; auth: Auth }) {
    return (
        <section className="mx-auto min-h-screen w-full max-w-6xl">
            <GridPattern
                squares={[
                    [4, 4],
                    [5, 1],
                    [8, 2],
                    [5, 3],
                    [5, 5],
                    [10, 10],
                    [12, 15],
                    [15, 10],
                    [10, 15],
                    [16, 11],
                    [11, 16],
                    [17, 12],
                ]}
                className={cn(
                    'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
                    'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
                )}
            />
            {/* Top Shades */}
            <div
                aria-hidden="true"
                className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
            >
                <div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
            </div>

            {/* X Bold Faded Borders */}
            <div
                aria-hidden="true"
                className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-6xl lg:block"
            >
                <div className="absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15 mask-y-from-80% mask-y-to-100%" />
                <div className="absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15 mask-y-from-80% mask-y-to-100%" />
            </div>

            {/* main content */}

            <div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-30">
                {/* X Content Faded Borders */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-1 size-full overflow-hidden"
                >
                    <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
                    <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
                    <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
                    <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
                </div>

                <a
                    className={cn(
                        'group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow',
                        'animate-in transition-all delay-500 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in',
                    )}
                    href="#link"
                >
                    <Sparkles className="size-3 text-muted-foreground" />
                    <span className="text-xs">{t('welcome.subtitle')}</span>
                    <span className="block h-5 border-l" />

                    <ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
                </a>

                <h1
                    className={cn(
                        'animate-in text-center text-4xl tracking-tight text-balance delay-100 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in md:text-5xl lg:text-6xl',
                        'text-shadow-[0_0px_50px_theme(--color-foreground/.2)]',
                    )}
                >
                    {/* Transaltion */}
                    {t('welcome.title')}
                </h1>

                <p className="sm:text-md mx-auto max-w-2xl animate-in text-center text-base tracking-wider text-foreground/80 delay-200 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in md:text-lg">
                    {/* Transaltion */}
                    {t('welcome.description')}
                </p>

                <div className="flex animate-in flex-row flex-wrap items-center justify-center gap-3 pt-2 delay-300 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in">
                    {auth.user ? (
                        <Link href={dashboard()}>
                            <Button className="rounded-full" size="lg">
                                {t('welcome.dashboard')}{' '}
                                <ArrowRightIcon data-icon="inline-end" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href={register()}>
                            <Button className="rounded-full" size="lg">
                                {t('welcome.buttonStarted')}{' '}
                                <ArrowRightIcon data-icon="inline-end" />
                            </Button>
                        </Link>
                    )}
                    {/* Transaltion */}
                </div>
            </div>
        </section>
    );
}
