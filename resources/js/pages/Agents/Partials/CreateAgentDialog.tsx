import { useForm } from '@inertiajs/react';
import { Bot, Loader2, Plus } from 'lucide-react';
import { useEffect } from 'react';
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
import { useTranslation } from '@/hooks/use-translation';
import { store } from '@/routes/agents';

interface CreateAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateAgentDialog({
    open,
    onOpenChange,
}: CreateAgentDialogProps) {
    const { t } = useTranslation();

    const form = useForm({
        name: '',
        system_prompt: '',
        webhook_url: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(store().url, {
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
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl bg-white/20 font-semibold text-white shadow-lg backdrop-blur-md hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20">
                    <Plus className="h-4 w-4" />
                    {t('agents.create_agent')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Bot className="h-5 w-5" />
                            {t('agents.create_agent')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('agents.create_agent_description')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="agent-name">
                                {t('agents.agent_name')}
                            </Label>
                            <Input
                                id="agent-name"
                                placeholder={t('agents.agent_name_placeholder')}
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                disabled={form.processing}
                                required
                            />
                            {form.errors.name && (
                                <p className="text-sm text-destructive">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="system-prompt">
                                {t('agents.system_prompt')}
                            </Label>
                            <Textarea
                                id="system-prompt"
                                placeholder={t(
                                    'agents.system_prompt_placeholder',
                                )}
                                value={form.data.system_prompt}
                                onChange={(e) =>
                                    form.setData(
                                        'system_prompt',
                                        e.target.value,
                                    )
                                }
                                disabled={form.processing}
                                rows={4}
                            />
                            {form.errors.system_prompt && (
                                <p className="text-sm text-destructive">
                                    {form.errors.system_prompt}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="webhook-url">
                                {t('agents.webhook_url')}
                            </Label>
                            <Input
                                id="webhook-url"
                                type="url"
                                placeholder={t(
                                    'agents.webhook_url_placeholder',
                                )}
                                value={form.data.webhook_url}
                                onChange={(e) =>
                                    form.setData('webhook_url', e.target.value)
                                }
                                disabled={form.processing}
                            />
                            {form.errors.webhook_url && (
                                <p className="text-sm text-destructive">
                                    {form.errors.webhook_url}
                                </p>
                            )}
                        </div>
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
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('agents.create_agent')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
