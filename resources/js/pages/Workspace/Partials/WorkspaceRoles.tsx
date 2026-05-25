import { useForm, router } from '@inertiajs/react';
import { Shield, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import teams from '@/routes/teams';

const teamsRolesStoreRoute = teams.roles.store;
const teamsRolesUpdateRoute = teams.roles.update;
const teamsRolesDestroyRoute = teams.roles.destroy;
import {
    PERMISSION_GROUPS,
    type Workspace,
    type WorkspaceRole,
} from '@/types';

interface WorkspaceRolesProps {
    workspace: Workspace;
    roles: WorkspaceRole[];
}

export function WorkspaceRoles({ workspace, roles }: WorkspaceRolesProps) {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<WorkspaceRole | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<WorkspaceRole | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        code: '',
        description: '',
        permissions: [] as string[],
    });

    const handleCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(teamsRolesStoreRoute({ slug: workspace.slug }).url, {
            onSuccess: () => {
                setCreateOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (role: WorkspaceRole) => {
        setEditingRole(role);
        setData({
            name: role.name,
            code: role.code,
            description: role.description ?? '',
            permissions: role.permissions.map((p) =>
                typeof p === 'string' ? p : p.code,
            ),
        });
    };

    const handleUpdate = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!editingRole) return;

        router.put(
            teamsRolesUpdateRoute({
                slug: workspace.slug,
                role: editingRole.id,
            }).url,
            {
                name: data.name,
                description: data.description,
                permissions: data.permissions,
            },
            {
                onSuccess: () => {
                    setEditingRole(null);
                    reset();
                },
            },
        );
    };

    const handleDelete = (role: WorkspaceRole) => {
        setRoleToDelete(role);
    };

    const confirmDeleteRole = () => {
        if (!roleToDelete) return;
        router.delete(
            teamsRolesDestroyRoute({
                slug: workspace.slug,
                role: roleToDelete.id,
            }).url,
        );
        setRoleToDelete(null);
    };

    const togglePermission = (permission: string) => {
        setData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter((p) => p !== permission)
                : [...prev.permissions, permission],
        }));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        {t('workspace.roles.title')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {t('workspace.roles.description')}
                    </p>
                </div>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="size-4" />
                            {t('workspace.roles.create')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {t('workspace.roles.create_title')}
                            </DialogTitle>
                            <DialogDescription>
                                {t('workspace.roles.create_description')}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="create-name">
                                        {t('workspace.roles.role_name')}
                                    </Label>
                                    <Input
                                        id="create-name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Editor"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-code">
                                        {t('workspace.roles.role_code')}
                                    </Label>
                                    <Input
                                        id="create-code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        placeholder="e.g., editor"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="create-description">
                                    {t('workspace.roles.role_description')}
                                </Label>
                                <Textarea
                                    id="create-description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    {t('workspace.roles.permissions')}
                                </Label>
                                <div className="max-h-60 space-y-3 overflow-y-auto rounded-lg border p-3">
                                    {PERMISSION_GROUPS.map((group) => (
                                        <div key={group.key}>
                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                {group.name}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {group.permissions.map(
                                                    (perm) => {
                                                        const permCode =
                                                            `${group.key}.${perm}`;
                                                        const isSelected =
                                                            data.permissions.includes(
                                                                permCode,
                                                            );
                                                        return (
                                                            <button
                                                                key={permCode}
                                                                type="button"
                                                                onClick={() =>
                                                                    togglePermission(
                                                                        permCode,
                                                                    )
                                                                }
                                                                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                                                    isSelected
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                                }`}
                                                            >
                                                                {isSelected && (
                                                                    <Check className="size-3" />
                                                                )}
                                                                {perm}
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCreateOpen(false)}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {t('workspace.roles.create')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Role Dialog */}
            <Dialog
                open={!!editingRole}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingRole(null);
                        reset();
                    }
                }}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {t('workspace.roles.edit_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('workspace.roles.edit_description')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">
                                    {t('workspace.roles.role_name')}
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {t('workspace.roles.role_code')}
                                </Label>
                                <Input
                                    value={data.code}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">
                                {t('workspace.roles.role_description')}
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>
                                {t('workspace.roles.permissions')}
                            </Label>
                            <div className="max-h-60 space-y-3 overflow-y-auto rounded-lg border p-3">
                                {PERMISSION_GROUPS.map((group) => (
                                    <div key={group.key}>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                            {group.name}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {group.permissions.map((perm) => {
                                                const permCode =
                                                    `${group.key}.${perm}`;
                                                const isSelected =
                                                    data.permissions.includes(
                                                        permCode,
                                                    );
                                                return (
                                                    <button
                                                        key={permCode}
                                                        type="button"
                                                        onClick={() =>
                                                            togglePermission(
                                                                permCode,
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                                            isSelected
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <Check className="size-3" />
                                                        )}
                                                        {perm}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditingRole(null);
                                    reset();
                                }}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {t('common.save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Roles Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {roles.map((role) => (
                    <Card key={role.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <Shield className="size-5 text-primary" />
                                <CardTitle className="text-base">
                                    {role.name}
                                </CardTitle>
                                {role.is_default && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {t('workspace.roles.default')}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    onClick={() => handleEdit(role)}
                                >
                                    <Edit2 className="size-4" />
                                </Button>
                                {role.code !== 'owner' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-destructive"
                                        onClick={() => handleDelete(role)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {role.description && (
                                <CardDescription className="mb-3">
                                    {role.description}
                                </CardDescription>
                            )}
                            <div className="flex flex-wrap gap-1">
                                {role.permissions.map((permission, idx) => {
                                    const code = typeof permission === 'string' ? permission : permission.code;
                                    return (
                                        <Badge key={code ?? idx} variant="outline">
                                            {code}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {roles.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
                    <Shield className="mb-3 size-10 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        {t('workspace.roles.empty')}
                    </p>
                </div>
            )}

            {/* Delete Role Confirmation */}
            <AlertDialog open={!!roleToDelete} onOpenChange={(open) => { if (!open) setRoleToDelete(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('workspace.roles.delete')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('workspace.roles.delete_confirm')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={confirmDeleteRole}>
                            {t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
