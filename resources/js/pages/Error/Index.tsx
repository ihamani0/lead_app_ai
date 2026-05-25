import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Home, ShieldAlert, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GridPattern } from '@/components/ui/grid-pattern';

interface ErrorPageProps {
    status: number;
}

const errorConfig: Record<number, {
    icon: typeof ShieldAlert;
    title: string;
    description: string;
    primaryAction: { label: string; href: string };
    secondaryAction?: { label: string; onClick: string };
}> = {
    403: {
        icon: ShieldAlert,
        title: '403 — Forbidden',
        description: 'You don\'t have permission to access this page. Please contact your workspace administrator if you think this is a mistake.',
        primaryAction: { label: 'Go Home', href: '/' },
    },
    404: {
        icon: FileQuestion,
        title: '404 — Page Not Found',
        description: 'The page you\'re looking for doesn\'t exist or has been moved. Check the URL or navigate back to a known page.',
        primaryAction: { label: 'Go Home', href: '/' },
        secondaryAction: { label: 'Go Back', onClick: 'history.back()' },
    },
};

export default function ErrorPage({ status }: ErrorPageProps) {
    const config = errorConfig[status] ?? {
        icon: ShieldAlert,
        title: `${status} — Error`,
        description: 'An unexpected error occurred. Please try again.',
        primaryAction: { label: 'Go Home', href: '/' },
    };

    const Icon = config.icon;

    return (
        <>
            <Head title={config.title} />

            <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
                <GridPattern
                    width={60}
                    height={60}
                    className="fill-muted/30 stroke-muted/30"
                />

                <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="h-10 w-10 text-primary" />
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                        {config.title}
                    </h1>

                    <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                        {config.description}
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <Button asChild>
                            <Link href={config.primaryAction.href}>
                                <Home className="mr-2 h-4 w-4" />
                                {config.primaryAction.label}
                            </Link>
                        </Button>

                        {config.secondaryAction && (
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {config.secondaryAction.label}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
