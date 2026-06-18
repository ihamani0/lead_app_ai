import { router } from '@inertiajs/react';
import { Bot, Loader2, Plus, X } from 'lucide-react';
import type { FC, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InlineEditField } from '@/components/ui/inline-edit-field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { cn } from '@/lib/utils';
import { update } from '@/routes/workspaces/leads';
import type { Lead } from '@/types';
import EditLead from './EditLead';

interface LeadDetailInfoProps {
    lead: Lead;
}

const statusBadge: Record<string, { bg: string; text: string }> = {
    new: { bg: 'bg-blue-100', text: 'text-blue-800' },
    contacted: { bg: 'bg-purple-100', text: 'text-purple-800' },
    qualified: { bg: 'bg-green-100', text: 'text-green-800' },
    unqualified: { bg: 'bg-gray-100', text: 'text-gray-700' },
    converted: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
};

const statusLabels: Record<string, string> = {
    new: 'Nouveau',
    contacted: 'En cours',
    qualified: 'Qualifié',
    unqualified: 'Non qualifié',
    converted: 'Converti',
};

function parseCustomData(lead: Lead): Record<string, unknown> {
    if (typeof lead.custom_data === 'string') {
        try {
            return JSON.parse(lead.custom_data) as Record<string, unknown>;
        } catch {
            return {};
        }
    }
    return (lead.custom_data as Record<string, unknown>) || {};
}

export const LeadDetailInfo: FC<LeadDetailInfoProps> = ({ lead }) => {
    const activeWorkspace = useActiveWorkspace();
    const sb = statusBadge[lead.status] ?? {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
    };

    const customData = parseCustomData(lead);
    const initialTags = (customData.tags as string[]) || [];
    const [tags, setTags] = useState<string[]>(initialTags);
    const [newTag, setNewTag] = useState('');
    const [addingTag, setAddingTag] = useState(false);
    const [savingTags, setSavingTags] = useState(false);
    const addTagInputRef = useRef<HTMLInputElement>(null);

    const saveTagsToServer = async (updatedTags: string[]) => {
        setSavingTags(true);
        const url = update({ slug: activeWorkspace!.slug, id: lead.id }).url;
        router.put(url, { custom_data: { tags: updatedTags } }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setSavingTags(false),
        });
    };

    const addTag = () => {
        const trimmed = newTag.trim();
        if (!trimmed || tags.includes(trimmed)) return;
        const updated = [...tags, trimmed];
        setTags(updated);
        setNewTag('');
        setAddingTag(false);
        saveTagsToServer(updated);
    };

    const removeTag = (tag: string) => {
        const updated = tags.filter((t) => t !== tag);
        setTags(updated);
        saveTagsToServer(updated);
    };

    const handleTagKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
        if (e.key === 'Escape') {
            setAddingTag(false);
            setNewTag('');
        }
    };

    const saveName = (name: string) => {
        const url = update({ slug: activeWorkspace!.slug, id: lead.id }).url;
        router.put(url, { name }, { preserveScroll: true, preserveState: true });
    };

    const saveNotes = (notes: string) => {
        const url = update({ slug: activeWorkspace!.slug, id: lead.id }).url;
        router.put(url, { notes }, { preserveScroll: true, preserveState: true });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                    Détails du lead
                </h3>
                <EditLead lead={lead} />
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nom complet</span>
                    <InlineEditField
                        value={lead.name}
                        onSave={saveName}
                        className="text-right text-xs font-medium"
                    />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Téléphone</span>
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                        +{lead.phone}
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-emerald-500"
                            fill="currentColor"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214H3.6l.581-2.12.188-.684a9.935 9.935 0 01-1.573-5.341c0-5.514 4.5-10.014 10.025-10.014 5.514 0 10.003 4.5 10.003 10.014 0 5.523-4.489 10.023-10.003 10.023z" />
                        </svg>
                    </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Source</span>
                    <span className="font-medium text-foreground">
                        WhatsApp
                    </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                        Première interaction
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                        Dernière activité
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {lead.last_activity_at
                            ? new Date(
                                  lead.last_activity_at,
                              ).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : '-'}
                    </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <Badge
                        className={cn(
                            sb.bg,
                            sb.text,
                            'border-0 text-[11px] font-medium',
                        )}
                    >
                        {statusLabels[lead.status] ?? lead.status}
                    </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Traitement</span>
                    <Badge
                        className={cn(
                            lead.treatment_status === 'TRAITE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600',
                            'border-0 text-[11px] font-medium',
                        )}
                    >
                        {lead.treatment_status === 'TRAITE' ? 'Traité' : 'Non traité'}
                    </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Propriétaire</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                        <Bot className="h-3.5 w-3.5 text-purple-600" />
                        IA Assistant
                    </span>
                </div>
                <Separator />
                <div>
                    <span className="mb-1.5 block text-xs text-muted-foreground">
                        Tags
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                className="flex items-center gap-1 border-0 bg-purple-100 text-[11px] text-purple-800"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-0.5 hover:text-purple-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                        {savingTags && (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        )}
                        {addingTag ? (
                            <Input
                                ref={addTagInputRef}
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={() => {
                                    if (!newTag.trim()) {
                                        setAddingTag(false);
                                    }
                                }}
                                placeholder="Nom du tag..."
                                className="h-6 w-28 text-[11px]"
                                autoFocus
                            />
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 gap-0.5 px-1.5 text-[11px] text-muted-foreground"
                                onClick={() => {
                                    setAddingTag(true);
                                    setNewTag('');
                                    requestAnimationFrame(() =>
                                        addTagInputRef.current?.focus(),
                                    );
                                }}
                            >
                                <Plus className="h-3 w-3" />
                                Ajouter
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Notes internes
                </h4>
                <div className="rounded-lg border bg-muted/50 p-3">
                    <InlineEditField
                        value={lead.notes || ''}
                        onSave={saveNotes}
                        type="textarea"
                        placeholder="Ajouter une note..."
                        className="text-xs leading-relaxed"
                    />
                </div>
                {lead.notes && (
                    <p className="text-[10px] text-muted-foreground">
                        Modifié par vous,{' '}
                        {new Date(lead.updated_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                )}
            </div>
        </div>
    );
};
