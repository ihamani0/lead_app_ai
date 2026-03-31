export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <h2
                className={
                    variant === 'small'
                        ? 'mb-0.5 text-sm font-medium md:text-base'
                        : 'text-lg font-semibold tracking-tight md:text-xl lg:text-2xl'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-xs text-muted-foreground md:text-sm">
                    {description}
                </p>
            )}
        </header>
    );
}
