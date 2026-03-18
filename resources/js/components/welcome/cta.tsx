import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DecorIcon } from '@/components/ui/decor-icon';
import { FullWidthDivider } from '../ui/full-width-divider';

export function CallToAction() {
    return (
        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-between gap-y-4 border-y px-4 py-8 dark:bg-[radial-gradient(35%_80%_at_25%_0%,--theme(--color-foreground/.08),transparent)]">
            <FullWidthDivider className="-top-px" />

            <DecorIcon className="size-4" position="top-left" />
            <DecorIcon className="size-4" position="top-right" />
            <DecorIcon className="size-4" position="bottom-left" />
            <DecorIcon className="size-4" position="bottom-right" />

            <div className="pointer-events-none absolute -inset-y-6 -left-px w-px border-l" />
            <div className="pointer-events-none absolute -inset-y-6 -right-px w-px border-r" />

            <div className="absolute top-0 left-1/2 -z-10 h-full border-l border-dashed" />

            <h2 className="text-center text-xl font-semibold md:text-3xl">
                Start for Free Today!
            </h2>
            <p className="text-center text-sm font-medium text-balance text-muted-foreground md:text-base">
                Begin your 6-day free trial today to fully explore and
                experience all the features and benefits we offer.
            </p>

            <div className="flex items-center justify-center gap-2">
                <Button variant="outline">Contact Sales</Button>
                <Button>
                    Get Started <ArrowRightIcon data-icon="inline-end" />
                </Button>
            </div>
            <FullWidthDivider className="-bottom-px" />
        </div>
    );
}
