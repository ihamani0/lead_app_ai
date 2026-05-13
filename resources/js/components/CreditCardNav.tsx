// Assuming you are using Tailwind CSS and Lucide-React for icons
import { CreditCard, AlertCircle } from 'lucide-react';
import type { User } from '@/types';

const CreditCardNav = ({ user } : {user:User}) => {
  const credit = user?.tenant?.credit ?? 0;
  const isLow = user?.tenant?.is_low_credit;
  const formattedCredit = credit.toFixed(2);

  // Dynamic classes based on low credit status
  const cardClasses = isLow
    ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-red-100'
    : 'bg-gradient-to-r from-slate-50 to-white border-slate-200 shadow-slate-200/50';

  const textClasses = isLow
    ? 'text-red-700'
    : 'text-slate-800';

  const iconClasses = isLow
    ? 'text-red-500 bg-red-100'
    : 'text-blue-600 bg-blue-50';

  const badgeClasses = isLow
    ? 'bg-red-100 text-red-700 border-red-200'
    : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-2xl border">
      {/* Icon Container */}
      <div className={`p-2 rounded-xl ${iconClasses}`}>
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
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${badgeClasses}`}>
              Low
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCardNav;