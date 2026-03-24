import type { TFunction } from 'i18next';
import { Quote } from 'lucide-react';

interface TestimonialsSectionProps {
    t: TFunction;
}

type Testimonial = {
    quote: string;
    name: string;
    role: string;
    company: string;
    avatar?: string;
    gradient: string;
};

export function TestimonialsSection({ t }: TestimonialsSectionProps) {
    const testimonials: Testimonial[] = [
        {
            quote: 'This platform transformed how we handle customer support. Our response time dropped by 80%!',
            name: 'Sarah Johnson',
            role: 'CEO',
            company: 'TechStart Inc.',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            quote: 'The AI agents are incredibly smart. They handle our leads while we sleep!',
            name: 'Michael Chen',
            role: 'Marketing Director',
            company: 'GrowthLabs',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            quote: 'We scaled our WhatsApp business from 1 to 10 instances in minutes. Game changer!',
            name: 'Emma Rodriguez',
            role: 'Operations Manager',
            company: 'GlobalSales',
            gradient: 'from-emerald-500 to-teal-500',
        },
        {
            quote: "Best investment we've made. The ROI was visible within the first month.",
            name: 'David Kim',
            role: 'Founder',
            company: 'StartupHub',
            gradient: 'from-orange-500 to-red-500',
        },
        {
            quote: 'Customer support is now 24/7. Our AI never sleeps and always delivers.',
            name: 'Lisa Thompson',
            role: 'Head of Support',
            company: 'ServicePro',
            gradient: 'from-violet-500 to-purple-500',
        },
        {
            quote: 'Simple to use yet powerful. Our team adopted it in less than a day.',
            name: 'Ahmed Hassan',
            role: 'Tech Lead',
            company: 'DevCraft',
            gradient: 'from-indigo-500 to-blue-500',
        },
    ];

    return (
        <section
            id="testimonials"
            className="bg-white px-6 py-24 dark:bg-gray-900"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-1.5 text-sm font-semibold text-purple-700 dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300">
                        {t('welcome.testimonials.badge', 'Testimonials')}
                    </span>
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        {t('welcome.testimonials.title', 'Loved by')}
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {' '}
                            {t(
                                'welcome.testimonials.titleHighlight',
                                'Businesses',
                            )}
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                        {t(
                            'welcome.testimonials.subtitle',
                            'See what our customers have to say about their experience.',
                        )}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.name}
                            testimonial={testimonial}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50">
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 transition-transform duration-300 group-hover:scale-150" />

            <div className="relative mb-4">
                <Quote className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            </div>

            <blockquote className="mb-6 text-gray-600 dark:text-gray-300">
                "{testimonial.quote}"
            </blockquote>

            <div className="flex items-center gap-4">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.gradient} text-lg font-bold text-white`}
                >
                    {testimonial.name.charAt(0)}
                </div>
                <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                    </div>
                </div>
            </div>
        </div>
    );
}
