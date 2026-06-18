import { Deferred, Head, Link } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
    ArrowLeft,
    MessageCircle,
    PanelRightClose,
    PanelRightOpen,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/workspaces/leads';
import type { Lead as LeadType, SimilarLead } from '@/types';
import { AvatarInitials } from './Partials/AvatarInitials';
import { LeadChat } from './Partials/LeadChat';
import { LeadDetailsPanel } from './Partials/LeadDetailsPanel';
import { SimilarLeads, SimilarLeadsSkeleton } from './Partials/SimilarLeads';

type Props = {
    lead: LeadType;
    similarLeads?: SimilarLead[];
};

export default function LeadShow({ lead, similarLeads }: Props) {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace();
    const [showDetails, setShowDetails] = useState(true);
    const [mobileTab, setMobileTab] = useState<'info' | 'chat' | 'details'>('chat');
    const [liveLead, setLiveLead] = useState<LeadType>(lead);

    useEffect(() => {
        setLiveLead(lead);
    }, [lead]);

    useEcho(`lead.${lead.id}`, ['LeadMessageUpdated'], (event) => {
        setLiveLead((prev) => ({
            ...prev,
            ...event.lead,
        }));
    });

    const customData =
        typeof liveLead.custom_data === 'string'
            ? (() => {
                  try {
                      return JSON.parse(liveLead.custom_data);
                  } catch {
                      return {};
                  }
              })()
            : liveLead.custom_data || {};

    return (
        <AppLayout>
            <Head title={`${liveLead.name} - ${t('leads.title')}`} />

            <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-background">
                <div className="flex items-center gap-3 border-b bg-card px-4 py-2.5">
                    <Link
                        href={index({ slug: activeWorkspace!.slug }).url}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            {t('leads.actions.backToList')}
                        </span>
                    </Link>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex min-w-0 items-center gap-2">
                        <AvatarInitials
                            name={liveLead.name}
                            id={liveLead.id}
                            size="sm"
                        />
                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-semibold text-foreground">
                                {liveLead.name}
                            </h1>
                            <p className="truncate text-xs text-muted-foreground">
                                +{liveLead.phone}
                            </p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs lg:hidden"
                            onClick={() => setMobileTab('info')}
                        >
                            <User className="h-3.5 w-3.5" />
                            Infos
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs lg:hidden"
                            onClick={() => setMobileTab('chat')}
                        >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Chat
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs lg:hidden"
                            onClick={() => setMobileTab('details')}
                        >
                            <PanelRightOpen className="h-3.5 w-3.5" />
                            Détails
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 hidden h-8 w-8 lg:inline-flex"
                            onClick={() => setShowDetails(!showDetails)}
                            title={
                                showDetails
                                    ? 'Masquer les détails'
                                    : 'Afficher les détails'
                            }
                        >
                            {showDetails ? (
                                <PanelRightClose className="h-4 w-4" />
                            ) : (
                                <PanelRightOpen className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div
                        className={`w-72 shrink-0 border-r bg-card ${
                            mobileTab === 'info' ? 'block' : 'hidden'
                        } lg:block`}
                    >
                        <ScrollArea className="h-full">
                            <div className="space-y-4 p-4">
                                <div className="flex flex-col items-center gap-2 py-4">
                                    <AvatarInitials
                                        name={liveLead.name}
                                        id={liveLead.id}
                                        size="lg"
                                    />
                                    <div className="text-center">
                                        <h2 className="text-sm font-semibold text-foreground">
                                            {liveLead.name}
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            +{liveLead.phone}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2 text-sm">
                                    <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Informations
                                    </h4>
                                    <div className="space-y-1.5">
                                        <InfoRow
                                            label="Source"
                                            value="WhatsApp"
                                        />
                                        <InfoRow
                                            label="Créé le"
                                            value={new Date(
                                                liveLead.created_at,
                                            ).toLocaleDateString('fr-FR')}
                                        />
                                        {liveLead.qualified_at && (
                                            <InfoRow
                                                label="Qualifié le"
                                                value={new Date(
                                                    liveLead.qualified_at,
                                                ).toLocaleDateString('fr-FR')}
                                            />
                                        )}
                                        {customData.budget && (
                                            <InfoRow
                                                label="Budget"
                                                value={customData.budget}
                                            />
                                        )}
                                        {customData.quartier && (
                                            <InfoRow
                                                label="Quartier"
                                                value={customData.quartier}
                                            />
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Actions
                                    </h4>
                                    <div className="space-y-1">
                                        <Link
                                            href={
                                                index({
                                                    slug: activeWorkspace!.slug,
                                                }).url
                                            }
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full justify-start text-xs"
                                            >
                                                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                                                Retour à la liste
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Prospects similaires
                                    </h4>
                                    <Deferred
                                        data="similarLeads"
                                        fallback={<SimilarLeadsSkeleton />}
                                    >
                                        <SimilarLeads leads={similarLeads as SimilarLead[]} />
                                    </Deferred>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                    <div
                        className={`flex min-h-0 flex-1 flex-col overflow-hidden ${
                            mobileTab === 'chat' ? 'block' : 'hidden'
                        } lg:flex`}
                    >
                        <LeadChat lead={liveLead} />
                    </div>

                    {showDetails && (
                        <div
                            className={`w-80 shrink-0 ${
                                mobileTab === 'details' ? 'block' : 'hidden'
                            } lg:block`}
                        >
                            <LeadDetailsPanel lead={liveLead} />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground">{value}</span>
        </div>
    );
}
