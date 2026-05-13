import { useForm } from '@inertiajs/react';
import { Settings, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { show as teamsShow , destroy as teamsDestroy } from '@/routes/teams';
import type { Workspace } from '@/types';

interface WorkspaceSettingsProps {
    workspace: Workspace;
}

export function WorkspaceSettings({ workspace }: WorkspaceSettingsProps) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: workspace.name,
        description: workspace.description || '',
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        put(teamsShow({ slug: workspace.slug }).url, {
            onSuccess: () => setEditing(false),
        });
    };

    const { delete: destroyWorkspace } = useForm({});
    const handleDelete = () => {
        if (confirm('Are you sure?')) {
            destroyWorkspace(teamsDestroy({ slug: workspace.slug }).url);
        }
    };


    return (
        <div className="space-y-6">
            {/* General Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Settings className="size-5 text-primary" />
                        <CardTitle>
                            {t('workspace.settings.general.title')}
                        </CardTitle>
                    </div>
                    <CardDescription>
                        {t('workspace.settings.general.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                {t('workspace.settings.general.name')}
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                disabled={!editing}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                {t(
                                    'workspace.settings.general.description_label',
                                )}
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={3}
                                disabled={!editing}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            {editing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditing(false)}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 size-4" />
                                        {t('common.save')}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                >
                                    {t('common.edit')}
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Separator />

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">
                        {t('workspace.settings.danger.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('workspace.settings.danger.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleDelete}>
                        {t('workspace.settings.danger.delete')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
