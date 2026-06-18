import { router } from '@inertiajs/react';
import { ChevronDown, Eye, MoreHorizontal, ShieldOff, CheckCircle, XCircle } from 'lucide-react';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { blockContact } from '@/lib/api/leadProfile';
import { update } from '@/routes/workspaces/leads';
import type { Lead } from '@/types';
import { AvatarInitials } from './AvatarInitials';
import { ContactProfileDialog } from './ContactProfileDialog';
import { OnlineDot } from './OnlineDot';

interface LeadChatHeaderProps {
    lead: Lead;
    onBlocked?: () => void;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Nouveau' },
    contacted: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'En cours' },
    qualified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Qualifié' },
    unqualified: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Non qualifié' },
    converted: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Converti' },
};

export const LeadChatHeader: FC<LeadChatHeaderProps> = ({ lead, onBlocked }) => {
    const activeWorkspace = useActiveWorkspace();
    const [currentStatus, setCurrentStatus] = useState<string>(lead.status);
    const [showProfile, setShowProfile] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [blocking, setBlocking] = useState(false);

    const instanceName =
        lead.instance?.display_name ||
        lead.instance?.instance_name ||
        'WhatsApp';

    const isOnline = lead.instance?.status === 'connected';
    const sc = statusConfig[currentStatus] ?? statusConfig.contacted;

    const updateStatus = useCallback(
        (status: string) => {
            const url = update({ slug: activeWorkspace!.slug, id: lead.id }).url;
            setCurrentStatus(status);
            router.put(url, { status }, { preserveScroll: true, preserveState: true });
        },
        [activeWorkspace, lead.id],
    );

    const handleToggleTreatment = useCallback(() => {
        const url = update({ slug: activeWorkspace!.slug, id: lead.id }).url;
        const isTreated = lead.treatment_status === 'TRAITE';
        router.put(
            url,
            { treatment_status: isTreated ? 'NON_TRAITE' : 'TRAITE', is_new: isTreated },
            { preserveScroll: true, preserveState: true },
        );
    }, [activeWorkspace, lead.id, lead.treatment_status]);

    const handleBlock = useCallback(async () => {
        setBlocking(true);
        try {
            const success = await blockContact(activeWorkspace!.slug, lead.id);
            if (success) {
                onBlocked?.();
            }
        } finally {
            setBlocking(false);
            setShowBlockConfirm(false);
        }
    }, [activeWorkspace, lead.id, onBlocked]);

    return (
        <>
            <div className="flex items-center gap-3 border-b bg-card px-4 py-3">
                <div className="relative shrink-0">
                    <AvatarInitials name={lead.name} id={lead.id} size="sm" />
                    <OnlineDot
                        online={isOnline}
                        className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 ring-2 ring-white"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                        {lead.name}
                        {lead.qualification_result === 'HOT' && (
                            <span className="ml-1">🔥</span>
                        )}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Via {instanceName}</span>
                        <OnlineDot online={isOnline} className="h-1.5 w-1.5" />
                        <span>+{lead.phone}</span>
                    </p>
                </div>

                {/* Status dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Badge
                            className={`${sc.bg} ${sc.text} flex cursor-pointer items-center gap-1 border-0 px-2 py-1 text-xs font-medium`}
                        >
                            {sc.label}
                            <ChevronDown className="h-3 w-3" />
                        </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <DropdownMenuItem key={key} onClick={() => updateStatus(key)}>
                                {currentStatus === key && (
                                    <span className="mr-2 text-primary">✓</span>
                                )}
                                {config.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Actions menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowProfile(true)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleToggleTreatment}>
                            {lead.treatment_status === 'TRAITE' ? (
                                <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Marquer comme non traité
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Marquer comme traité
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setShowBlockConfirm(true)}
                        >
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Bloquer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Profile dialog */}
            <ContactProfileDialog
                lead={lead}
                open={showProfile}
                onOpenChange={setShowProfile}
            />

            {/* Block confirmation dialog */}
            <AlertDialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bloquer ce contact ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Le bot sera mis en pause et ce contact sera ajouté à la liste
                            d'interception. Vous pourrez reprendre la conversation manuellement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={blocking}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBlock}
                            disabled={blocking}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {blocking ? 'Blocage...' : 'Bloquer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
