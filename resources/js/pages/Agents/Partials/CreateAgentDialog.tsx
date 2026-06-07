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
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import workspaces from '@/routes/workspaces';

interface CreateAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateAgentDialog({
    open,
    onOpenChange,
}: CreateAgentDialogProps) {
    const activeWorkspace = useActiveWorkspace()!;
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
            post(workspaces.agents.store({ slug: activeWorkspace.slug }).url, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    useEffect(() => {
        if (!open) {
                reset();
                clearErrors();
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl bg-white/20 font-semibold text-foreground shadow-lg backdrop-blur-md hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20">
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

                    <div className="mt-4 ">
                        <div className="space-y-3">
                            <Label htmlFor="agent-name">
                                {t('agents.agent_name')}
                            </Label>
                            <Input
                                id="agent-name"
                                placeholder={t('agents.agent_name_placeholder')}
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                disabled={processing}
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
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
