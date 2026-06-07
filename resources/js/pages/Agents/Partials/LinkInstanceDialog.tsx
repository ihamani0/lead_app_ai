import { useForm } from '@inertiajs/react';
import { Loader2, Link2, Phone } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import workspaces from '@/routes/workspaces';
import type { AgentConfig, EvolutionInstance } from '@/types';


interface LinkInstanceDialogProps {
    agent: AgentConfig | null;
    availableInstances: EvolutionInstance[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LinkInstanceDialog({
    agent,
    availableInstances,
    open,
    onOpenChange,
}: LinkInstanceDialogProps) {
    const activeWorkspace = useActiveWorkspace()!;
    const { t } = useTranslation();

    const form = useForm({
        instance_id: '',
        webhook_url: '',
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!agent) return;

        form.post(workspaces.agents.linkInstance({ slug: activeWorkspace.slug, agent: agent.id }).url, {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    useEffect(() => {
        if (!open) {
            form.reset();
            form.clearErrors();
        }
    }, [open ]);

    if (!agent) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Link2 className="h-5 w-5" />
                            {t('agents.link_instance')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('agents.select_instance')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        
                        {availableInstances.length > 0 ? (
                            <div className="space-y-2">
                            <Label>{t('agents.available_instances')}</Label>
                            <Select
                                value={form.data.instance_id}
                                onValueChange={(value) =>
                                    form.setData('instance_id', value)
                                }
                                disabled={form.processing}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'agents.select_instance',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableInstances.map((instance) => (
                                        <SelectItem
                                            key={instance.id}
                                            value={String(instance.id)}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Phone className="h-3.5 w-3.5" />
                                                {instance.display_name ||
                                                    instance.instance_name}
                                                {instance.phone_number &&
                                                    ` (+${instance.phone_number})`}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.errors.instance_id && (
                                <p className="text-sm text-destructive">
                                    {form.errors.instance_id}
                                </p>
                            )}
                        </div>
                        ):(
                            // make compoents ther is not instance avaible her
                            <div className='w-full flex items-center justify-center mt-4'>
                                <span className='text-muted-foreground text-sm'>no WhatsApp avaible</span>
                                 
                            </div>
                        )}
                        

                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing || !form.data.instance_id}
                        >
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Linking...
                                </>
                            ) : (
                                <>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    {t('agents.link_instance')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
