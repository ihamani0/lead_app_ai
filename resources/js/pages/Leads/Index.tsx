import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { getTempBadge } from '@/lib/leadHelper';
import type { Lead as LeadType } from '@/types';
import ViewLead from './Partials/ViewLead';
import Pagination from '@/components/pagination';

type Props = {
      leads: { data: LeadType[]; links: PaginationLink[] };
}

export default function LeadsIndex({ leads }: Props ) {
    // Styling helper for Temperature

    return (
        <AppLayout>
            <Head title="CRM Leads" />
            <div className="space-y-6 py-12 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            AI Qualified Leads
                        </h2>
                        <p className="text-muted-foreground">
                            Contacts processed and scored by your AI Agent.
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-background">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-background dark:text-foreground">
                            <TableRow>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Temperature</TableHead>
                                <TableHead className="w-[200px]">
                                    AI Score
                                </TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.data.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell>
                                        <p className="font-medium text-slate-900 dark:text-foreground">
                                            {lead.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-foreground">
                                            +{lead.phone}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {lead.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getTempBadge(lead.temperature)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={
                                                    lead.qualification_score ||
                                                    0
                                                }
                                                className="h-2"
                                            />
                                            <span className="w-8 text-xs font-medium">
                                                {lead.qualification_score || 0}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                        {new Date(
                                            lead.updated_at,
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {/* Create this Show page next if you want detailed views */}
                                        <ViewLead selectedLead={lead} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {leads.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No leads generated yet. Wait for the AI
                                        to process incoming chats!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Add Pagination Component here if needed */}
                <Pagination links={leads.links} />
            </div>
        </AppLayout>
    );
}
