// Assuming you are using Tailwind CSS and Lucide-React for icons
import { CreditCard, AlertCircle } from 'lucide-react';
import type { User } from '@/types';

const CreditCardNav = ({ user }: { user: User }) => {
    const credit = user?.tenant?.credit ?? 0;
    const isLow = user?.tenant?.is_low_credit;
    const formattedCredit = credit.toFixed(2);

    const textClasses = isLow
        ? 'text-red-700'
        : 'dark:text-slate-200 text-slate-800';

    const iconClasses = isLow
        ? 'text-red-500 bg-red-100'
        : 'dark:text-blue-400 text-blue-600 bg-blue-50';

    const badgeClasses = isLow
        ? 'bg-red-100 text-red-700 border-red-200'
        : 'dark:bg-blue-50 text-blue-700 border-blue-200';

    return (
        <div className="flex items-center gap-3 rounded-2xl border px-3 py-2">
            {/* Icon Container */}
            <div className={`rounded-xl p-2 ${iconClasses}`}>
                {isLow ? (
                    <AlertCircle size={20} strokeWidth={2.5} />
                ) : (
                    <CreditCard size={20} strokeWidth={2.5} />
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${textClasses}`}>
                        ${formattedCredit}
                    </span>

                    {/* Status Badge (Optional, adds clarity) */}
                    {isLow && (
                        <span
                            className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${badgeClasses}`}
                        >
                            Low
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreditCardNav;
