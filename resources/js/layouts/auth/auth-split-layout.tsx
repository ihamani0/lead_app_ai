import { BarChart3, Bot, Link2, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import i18n from '@/i18n';
import { cn } from '@/lib/utils';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
    brandPosition = 'left',
}: AuthLayoutProps) {
    const { t } = useTranslation();
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const [activeSlide, setActiveSlide] = useState(0);

    const switchLanguage = (lang: string) => {
        setCurrentLang(lang);
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
    };

    // Carousel Data - Replace the description keys with your actual i18n keys
    const carouselSlides = [
        {
            icon: Bot,
            title: t('auth.brand.feature1'),
            desc: t(
                'auth.brand.feature1_desc',
                'Advanced AI algorithms that learn and adapt to your unique workflow naturally.',
            ),
            color: 'text-violet-300',
            bg: 'bg-violet-500/20',
        },
        {
            icon: Zap,
            title: t('auth.brand.feature2'),
            desc: t(
                'auth.brand.feature2_desc',
                'Lightning-fast responses powered by state-of-the-art cloud infrastructure.',
            ),
            color: 'text-amber-300',
            bg: 'bg-amber-500/20',
        },
        {
            icon: BarChart3,
            title: t('auth.brand.feature3'),
            desc: t(
                'auth.brand.feature3_desc',
                'Deep analytics and insights to help you make data-driven decisions.',
            ),
            color: 'text-emerald-300',
            bg: 'bg-emerald-500/20',
        },
        {
            icon: Link2,
            title: t('auth.brand.feature4'),
            desc: t(
                'auth.brand.feature4_desc',
                'Seamlessly integrates with your favorite tools in just a few clicks.',
            ),
            color: 'text-sky-300',
            bg: 'bg-sky-500/20',
        },
    ];

    // Auto-play Carousel Effect
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000); // Changes slide every 5 seconds
        return () => clearInterval(timer);
    }, [carouselSlides.length]);

    const brandPanel = (
        <div className="relative hidden h-full min-h-[280px] flex-col justify-between overflow-hidden bg-[#4C3BCF] p-8 text-white lg:flex lg:p-12 xl:p-16">
            {/* --- Animated Background Orbs --- */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 h-[400px] w-[400px] animate-pulse rounded-full bg-violet-400/20 blur-[80px] duration-1000" />
                <div className="absolute -bottom-32 -left-16 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
                <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-[60px]" />
            </div>

            <div className="relative z-10 flex h-full flex-col">
                {/* Header: Logo & Language */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo-white.png"
                            alt="MyIA"
                            className="h-8 w-8"
                        />
                    </div>
                    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 p-0.5 backdrop-blur-md">
                        {['en', 'fr'].map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => switchLanguage(lang)}
                                className={cn(
                                    'rounded-md px-3 py-1 text-xs font-semibold uppercase transition-all duration-300',
                                    currentLang === lang
                                        ? 'bg-white text-[#4C3BCF] shadow-sm'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white',
                                )}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto mb-auto flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="bg-linear-to-r from-white to-white/70 bg-clip-text font-display text-[36px] leading-tight font-bold tracking-tight text-transparent lg:text-[42px]">
                            {t(
                                'auth.brand.headline',
                                'Supercharge your workflow',
                            )}
                        </h2>
                        <p className="mt-4 max-w-md font-display text-[16px] leading-relaxed text-white/80">
                            {t(
                                'auth.brand.tagline',
                                'Join thousands of professionals who are using AI to work smarter, not harder.',
                            )}
                        </p>
                    </div>

                    {/* Carousel Card */}
                    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                        {/* Abstract top glow on card */}
                        <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-white/40 to-transparent" />

                        <div className="relative min-h-[140px]">
                            {carouselSlides.map((slide, index) => {
                                const Icon = slide.icon;
                                const isActive = activeSlide === index;
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'absolute inset-0 flex flex-col transition-all duration-700 ease-in-out',
                                            isActive
                                                ? 'relative z-10 translate-y-0 opacity-100'
                                                : 'pointer-events-none absolute z-0 translate-y-4 opacity-0',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'mb-4 flex size-12 items-center justify-center rounded-xl border border-white/10',
                                                slide.bg,
                                            )}
                                        >
                                            <Icon
                                                size={24}
                                                className={slide.color}
                                            />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-white">
                                            {slide.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-white/70">
                                            {slide.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Carousel Progress Indicators */}
                        <div className="mt-8 flex gap-2">
                            {carouselSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveSlide(index)}
                                    className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20 transition-all hover:bg-white/30"
                                >
                                    <div
                                        className={cn(
                                            'absolute top-0 bottom-0 left-0 bg-white transition-all',
                                            activeSlide === index
                                                ? 'w-full duration-5000 ease-linear'
                                                : 'w-0 duration-300',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <p className="text-xs text-white/50">
                        {t(
                            'auth.brand.copyright',
                            '© 2026 MyIA. All rights reserved.',
                        )}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                        <span>Powered by MyIA</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const formPanel = (
        <div className="flex min-h-svh flex-col bg-white px-6 py-8 lg:px-12 xl:px-20">
            <div className="mt-12 flex flex-1 flex-col justify-center lg:mt-16">
                <div className="mx-auto w-full max-w-md lg:mx-0">
                    <h1 className="text-[28px] font-bold tracking-tight text-[#0F0F10]">
                        {title}
                    </h1>
                    {description && (
                        <div className="mt-2 text-[15px] text-[#6B6B80]">
                            {description}
                        </div>
                    )}
                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-svh flex-col lg:grid lg:min-h-dvh lg:grid-cols-[2fr_3fr]">
            {brandPosition === 'left' ? (
                <>
                    {brandPanel}
                    {formPanel}
                </>
            ) : (
                <>
                    {formPanel}
                    {brandPanel}
                </>
            )}
        </div>
    );
}
