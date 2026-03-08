// components/Pagination.tsx
import { Link } from '@inertiajs/react';

// Optional: Helper to decode HTML entities
function decodeHTMLEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

type Props = {
    links: PaginationLink[];
};

function Pagination({ links }: Props) {
    return (
        <div className="flex justify-center gap-2">
            {links.map((link, i) =>
                link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        className={`rounded-md px-3 py-1 text-sm ${
                            link.active
                                ? 'bg-primary text-white dark:bg-slate-100 dark:text-slate-900'
                                : 'bg-muted text-foreground'
                        }`}
                    >
                        {decodeHTMLEntities(link.label)}{' '}
                        {/* ✅ No dangerouslySetInnerHTML */}
                    </Link>
                ) : (
                    <span
                        key={i}
                        className="rounded-md px-3 py-1 text-sm text-muted-foreground"
                    >
                        {decodeHTMLEntities(link.label)} {/* ✅ Same here */}
                    </span>
                ),
            )}
        </div>
    );
}

export default Pagination;
