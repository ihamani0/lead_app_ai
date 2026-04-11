import { useForm } from '@inertiajs/react';
import { Edit2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { update } from '@/routes/leads';
import type { Lead } from '@/types';

export default function EditLead({ lead }: { lead: Lead }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        qualification_result: string;
        qualification_score: number | null;
        treatment_status: string;
        notes: string;
    }>({
        name: lead.name || '',
        qualification_result: lead.qualification_result || '',
        qualification_score: lead.qualification_score ?? null,
        treatment_status: lead.treatment_status || '',
        notes: lead.notes || '',
    });

    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();
        put(update(lead.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setData({
                name: lead.name || '',
                qualification_result: lead.qualification_result || '',
                qualification_score: lead.qualification_score ?? null,
                treatment_status: lead.treatment_status || '',
                notes: lead.notes || '',
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    title="Edit Lead"
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Modifier le lead</DialogTitle>
                        <DialogDescription>
                            Mettez à jour les détails du contact et le statut de
                            qualification.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="ex: John Doe"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Qualification Result */}
                        <div className="space-y-2">
                            <Label htmlFor="qualification_result">
                                Résultat de qualification
                            </Label>
                            <select
                                id="qualification_result"
                                value={data.qualification_result}
                                onChange={(e) =>
                                    setData(
                                        'qualification_result',
                                        e.target.value,
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                <option value="">Sélectionner...</option>
                                <option value="HOT">Hot</option>
                                <option value="WARM">Warm</option>
                                <option value="COLD">Cold</option>
                            </select>
                        </div>

                        {/* Qualification Score 0-10 */}
                        <div className="space-y-2">
                            <Label htmlFor="qualification_score">
                                Score de qualification (0-10)
                            </Label>
                            <select
                                id="qualification_score"
                                value={data.qualification_score ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'qualification_score',
                                        e.target.value
                                            ? parseInt(e.target.value)
                                            : null,
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                <option value="">Sélectionner...</option>
                                {[...Array(11)].map((_, i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Treatment Status */}
                        <div className="space-y-2">
                            <Label htmlFor="treatment_status">
                                Statut de traitement
                            </Label>
                            <select
                                id="treatment_status"
                                value={data.treatment_status}
                                onChange={(e) =>
                                    setData('treatment_status', e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                <option value="">Sélectionner...</option>
                                <option value="TRAITE">Traité</option>
                                <option value="NON_TRAITE">Non traité</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                placeholder="Ajouter des notes..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
