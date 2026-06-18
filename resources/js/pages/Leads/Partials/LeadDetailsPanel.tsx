import type { FC } from 'react';
import { Separator } from '@/components/ui/separator';
import type { Lead } from '@/types';
import { IAInsights } from './IAInsights';
import { LeadDetailInfo } from './LeadDetailInfo';

interface LeadDetailsPanelProps {
    lead: Lead;
}

export const LeadDetailsPanel: FC<LeadDetailsPanelProps> = ({ lead }) => {
    return (
        <div className="flex h-full flex-col overflow-y-auto border-l bg-card">
            <div className="space-y-5 p-4 pb-8">
                <IAInsights lead={lead} />
                <Separator />
                <LeadDetailInfo lead={lead} />
            </div>
        </div>
    );
};
