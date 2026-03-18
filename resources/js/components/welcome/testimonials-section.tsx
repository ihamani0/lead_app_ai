import { QuoteIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DecorIcon } from '@/components/ui/decor-icon';
import { cn } from '@/lib/utils';

type Testimonial = {
    quote: string;
    name: string;
    role: string;
    company: string;
    image: string;
};

const testimonials: Testimonial[] = [
    {
        quote: "We just acquired Crew for 3 gazillion dollars. We're calling it iCrew. It's our best product yet.",
        image: '',
        name: 'Mehdi Benhida',
        role: '-',
        company: '',
    },
    {
        quote: "We just acquired Crew for 3 gazillion dollars. We're calling it iCrew. It's our best product yet.",
        image: '',
        name: 'HAMANI Bouthaina',
        role: '-',
        company: '',
    },
];

export function TestimonialsSection() {
    return (
        <div className="mx-auto mb-100 grid w-full max-w-6xl gap-8 md:grid-cols-3 md:gap-6">
            <div className="px-4 pt-12 pb-6">
                <div className="space-y-5">
                    <h2 className="text-4xl font-bold text-balance md:text-6xl lg:font-black">
                       Testimonia
                    </h2>
                    <p className="text-muted-foreground">
                        Used by Our Costumers.
                    </p>
                </div>
            </div>
            {testimonials.map((testimonial, index) => (
                <TestimonialCard
                    index={index}
                    key={testimonial.name}
                    testimonial={testimonial}
                />
            ))}
        </div>
    );
}

function TestimonialCard({
    testimonial,
    index,
    className,
    ...props
}: React.ComponentProps<'figure'> & {
    testimonial: Testimonial;
    index: number;
}) {
    const { quote, name, role, company, image } = testimonial;

    return (
        <figure
            className={cn(
                'relative flex flex-col justify-between gap-6 px-8 pt-8 pb-6 shadow-xs md:translate-y-[calc(3rem*var(--t-card-index))]',
                'dark:bg-[radial-gradient(50%_80%_at_25%_0%,--theme(--color-foreground/.1),transparent)]',
                className,
            )}
            style={
                {
                    '--t-card-index': index,
                } as React.CSSProperties
            }
            {...props}
        >
            <div className="absolute -inset-y-4 -left-px w-px bg-border" />
            <div className="absolute -inset-y-4 -right-px w-px bg-border" />
            <div className="absolute -inset-x-4 -top-px h-px bg-border" />
            <div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
            <DecorIcon className="size-3.5" position="top-left" />

            <blockquote className="flex gap-4">
                <QuoteIcon
                    aria-hidden="true"
                    className="size-6 shrink-0 stroke-1"
                />

                <p className="flex-1 text-base leading-relaxed font-normal text-muted-foreground">
                    {quote}
                </p>
            </blockquote>

            <figcaption className="flex items-center gap-3">
                <Avatar className="size-10 rounded-full ring-2 ring-border ring-offset-2 ring-offset-background transition-shadow group-hover:ring-foreground/20">
                    <AvatarImage
                        alt={`${name}'s profile picture`}
                        src={image}
                    />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <cite className="text-sm font-medium text-foreground not-italic">
                        {name}
                    </cite>
                    <p className="text-xs text-muted-foreground">
                        {role},{' '}
                        <span className="text-foreground/80">{company}</span>
                    </p>
                </div>
            </figcaption>
        </figure>
    );
}
