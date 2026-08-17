import { Head, useForm } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import admin from '@/routes/admin';

interface Plan {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    price_millicents: number;
    price_yearly_millicents: number | null;
    max_teams: number | null;
    max_members: number | null;
    max_leads: number | null;
    max_agents: number | null;
    max_instances: number | null;
    max_storage_mb: number | null;
    dollar_limit: number | null;
    paddle_price_id: string | null;
    paddle_price_id_yearly: string | null;
    features: Record<string, boolean> | null;
    is_active: boolean;
    is_default: boolean;
    tenants_count: number;
    created_at: string;
}

interface PageProps {
    plans: Plan[];
    availableFeatures: string[];
}

const formatPrice = (millicents: number): string => {
    return `$${(millicents / 100_000).toFixed(2)}/mo`;
};

const formatLimit = (value: number | null): string => {
    if (value === null || value === undefined) return '\u221E';
    return value.toLocaleString();
};

const formatFeatureLabel = (key: string): string => {
    return key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const buildDefaultFeatures = (availableFeatures: string[]): Record<string, boolean> => {
    return Object.fromEntries(availableFeatures.map((f) => [f, false]));
};

export default function Index({ plans, availableFeatures }: PageProps) {
    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

    const isEditing = editingPlan !== null;

    const form = useForm({
        slug: '',
        name: '',
        description: '',
        price_millicents: 0,
        price_yearly_millicents: 0,
        max_teams: null as number | null,
        max_members: null as number | null,
        max_leads: null as number | null,
        max_agents: null as number | null,
        max_instances: null as number | null,
        max_storage_mb: null as number | null,
        dollar_limit: null as number | null,
        paddle_price_id: '',
        paddle_price_id_yearly: '',
        features: buildDefaultFeatures(availableFeatures),
        is_active: true,
        is_default: false,
    });

    const openCreateDialog = () => {
        setEditingPlan(null);
        form.reset();
        form.setData('features', buildDefaultFeatures(availableFeatures));
        setDialogOpen(true);
    };

    const openEditDialog = (plan: Plan) => {
        setEditingPlan(plan);
        form.setData({
            slug: plan.slug,
            name: plan.name,
            description: plan.description ?? '',
            price_millicents: plan.price_millicents,
            price_yearly_millicents: plan.price_yearly_millicents,
            max_teams: plan.max_teams,
            max_members: plan.max_members,
            max_leads: plan.max_leads,
            max_agents: plan.max_agents,
            max_instances: plan.max_instances,
            max_storage_mb: plan.max_storage_mb,
            dollar_limit: plan.dollar_limit,
            paddle_price_id: plan.paddle_price_id ?? '',
            paddle_price_id_yearly: plan.paddle_price_id_yearly ?? '',
            features: { ...buildDefaultFeatures(availableFeatures), ...(plan.features ?? {}) },
            is_active: plan.is_active,
            is_default: plan.is_default,
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && editingPlan) {
            form.post(admin.plan.update(editingPlan.id).url, {
                onSuccess: () => {
                    setDialogOpen(false);
                    setEditingPlan(null);
                },
            });
        } else {
            form.post(admin.plan.store().url, {
                onSuccess: () => {
                    setDialogOpen(false);
                },
            });
        }
    };

    const handleDelete = (plan: Plan) => {
        setDeletingPlan(plan);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!deletingPlan) return;
        form.delete(admin.plan.destroy(deletingPlan.id).url, {
            onSuccess: () => {
                setDeleteOpen(false);
                setDeletingPlan(null);
            },
        });
    };

    const toggleFeature = (key: string) => {
        form.setData('features', {
            ...form.data.features,
            [key]: !form.data.features[key],
        });
    };

    return (
        <SuperAdminLayout>
            <Head title={t('superAdmin.plans.title')} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold lg:text-4xl">
                        {t('superAdmin.plans.pageTitle')}
                    </h1>
                </div>
                <Separator />

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                {t('superAdmin.plans.cardTitle')}
                            </CardTitle>
                            <Dialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button onClick={openCreateDialog}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('superAdmin.plans.addPlan')}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {isEditing
                                                ? t(
                                                      'superAdmin.plans.dialogEditTitle',
                                                  )
                                                : t(
                                                      'superAdmin.plans.dialogTitle',
                                                  )}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {isEditing
                                                ? t(
                                                      'superAdmin.plans.dialogEditDescription',
                                                  )
                                                : t(
                                                      'superAdmin.plans.dialogDescription',
                                                  )}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    {t(
                                                        'superAdmin.plans.labels.name',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={form.data.name}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.placeholders.name',
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="slug">
                                                    {t(
                                                        'superAdmin.plans.labels.slug',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="slug"
                                                    value={form.data.slug}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'slug',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.placeholders.slug',
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">
                                                {t(
                                                    'superAdmin.plans.labels.description',
                                                )}
                                            </Label>
                                            <Input
                                                id="description"
                                                value={form.data.description}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    'superAdmin.plans.placeholders.description',
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="price">
                                                {t(
                                                    'superAdmin.plans.labels.price',
                                                )}
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={
                                                    form.data.price_millicents
                                                        ? (
                                                              form.data
                                                                  .price_millicents /
                                                              100_000
                                                          ).toFixed(2)
                                                        : '0.00'
                                                }
                                                onChange={(e) => {
                                                    const dollars =
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0;
                                                    form.setData(
                                                        'price_millicents',
                                                        Math.round(
                                                            dollars * 100_000,
                                                        ),
                                                    );
                                                }}
                                                placeholder={t(
                                                    'superAdmin.plans.placeholders.price',
                                                )}
                                            />
                                        </div>

                                        <Separator />
                                        <div className="space-y-2">
                                            <Label className="text-base font-semibold">
                                                {t(
                                                    'superAdmin.plans.sections.paddle',
                                                )}
                                            </Label>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="paddle_price_id">
                                                {t(
                                                    'superAdmin.plans.labels.paddlePriceId',
                                                )}
                                            </Label>
                                            <Input
                                                id="paddle_price_id"
                                                value={form.data.paddle_price_id}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'paddle_price_id',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="pri_..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="paddle_price_id_yearly">
                                                {t(
                                                    'superAdmin.plans.labels.paddlePriceIdYearly',
                                                )}
                                            </Label>
                                            <Input
                                                id="paddle_price_id_yearly"
                                                value={form.data.paddle_price_id_yearly}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'paddle_price_id_yearly',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="pri_..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price_yearly">
                                                {t(
                                                    'superAdmin.plans.labels.priceYearly',
                                                )}
                                            </Label>
                                            <Input
                                                id="price_yearly"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={
                                                    form.data
                                                        .price_yearly_millicents
                                                        ? (
                                                              form.data
                                                                  .price_yearly_millicents /
                                                              100_000
                                                          ).toFixed(2)
                                                        : '0.00'
                                                }
                                                onChange={(e) => {
                                                    const dollars =
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0;
                                                    form.setData(
                                                        'price_yearly_millicents',
                                                        Math.round(
                                                            dollars * 100_000,
                                                        ),
                                                    );
                                                }}
                                                placeholder={t(
                                                    'superAdmin.plans.placeholders.price',
                                                )}
                                            />
                                        </div>

                                        <Separator />
                                        <div className="space-y-2">
                                            <Label className="text-base font-semibold">
                                                {t(
                                                    'superAdmin.plans.sections.limits',
                                                )}
                                            </Label>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="max_teams">
                                                    {t(
                                                        'superAdmin.plans.labels.maxTeams',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="max_teams"
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        form.data.max_teams ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'max_teams',
                                                            e.target.value
                                                                ? parseInt(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.fields.unlimited',
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="max_members">
                                                    {t(
                                                        'superAdmin.plans.labels.maxMembers',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="max_members"
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        form.data.max_members ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'max_members',
                                                            e.target.value
                                                                ? parseInt(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.fields.unlimited',
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="max_leads">
                                                    {t(
                                                        'superAdmin.plans.labels.maxLeads',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="max_leads"
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        form.data.max_leads ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'max_leads',
                                                            e.target.value
                                                                ? parseInt(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.fields.unlimited',
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="max_agents">
                                                    {t(
                                                        'superAdmin.plans.labels.maxAgents',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="max_agents"
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        form.data.max_agents ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'max_agents',
                                                            e.target.value
                                                                ? parseInt(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.fields.unlimited',
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="max_instances">
                                                    {t(
                                                        'superAdmin.plans.labels.maxInstances',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="max_instances"
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        form.data
                                                            .max_instances ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'max_instances',
                                                            e.target.value
                                                                ? parseInt(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.fields.unlimited',
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="max_storage_mb">
                                                    Storage (MB)
                                                </Label>
                                                <Input
                                                    id="max_storage_mb"
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        form.data
                                                            .max_storage_mb ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'max_storage_mb',
                                                            e.target.value
                                                                ? parseInt(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.fields.unlimited',
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dollar_limit">
                                                    {t(
                                                        'superAdmin.plans.labels.dollarLimit',
                                                    )}
                                                </Label>
                                                <Input
                                                    id="dollar_limit"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        form.data
                                                            .dollar_limit ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'dollar_limit',
                                                            e.target.value
                                                                ? parseInt(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'superAdmin.plans.fields.unlimited',
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <Separator />
                                        <div className="space-y-2">
                                            <Label className="text-base font-semibold">
                                                {t(
                                                    'superAdmin.plans.sections.features',
                                                )}
                                            </Label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {availableFeatures.map((key) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        id={`feature-${key}`}
                                                        checked={
                                                            form.data.features[
                                                                key
                                                            ] ?? false
                                                        }
                                                        onCheckedChange={() =>
                                                            toggleFeature(key)
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`feature-${key}`}
                                                        className="cursor-pointer"
                                                    >
                                                        {formatFeatureLabel(key)}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator />
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="is_active"
                                                checked={form.data.is_active}
                                                onCheckedChange={(checked) =>
                                                    form.setData(
                                                        'is_active',
                                                        checked,
                                                    )
                                                }
                                            />
                                            <Label htmlFor="is_active">
                                                {t(
                                                    'superAdmin.plans.labels.status',
                                                )}
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="is_default"
                                                checked={form.data.is_default}
                                                onCheckedChange={(checked) =>
                                                    form.setData(
                                                        'is_default',
                                                        checked,
                                                    )
                                                }
                                            />
                                            <Label htmlFor="is_default">
                                                {t(
                                                    'superAdmin.plans.labels.default',
                                                )}
                                            </Label>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setDialogOpen(false)
                                                }
                                            >
                                                {t(
                                                    'superAdmin.plans.cancelButton',
                                                )}
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={form.processing}
                                            >
                                                {isEditing
                                                    ? t(
                                                          'superAdmin.plans.saveButton',
                                                      )
                                                    : t(
                                                          'superAdmin.plans.button',
                                                      )}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.name',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.price',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.tenants',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.teams',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.members',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.leads',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.agents',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.instances',
                                        )}
                                    </TableHead>
                                    <TableHead>Storage</TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.default',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.status',
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t(
                                            'superAdmin.plans.table.headers.actions',
                                        )}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {plan.name}
                                            </div>
                                            {plan.description && (
                                                <div className="text-xs text-muted-foreground">
                                                    {plan.description}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {formatPrice(plan.price_millicents)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                                {plan.tenants_count}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {formatLimit(plan.max_teams)}
                                        </TableCell>
                                        <TableCell>
                                            {formatLimit(plan.max_members)}
                                        </TableCell>
                                        <TableCell>
                                            {formatLimit(plan.max_leads)}
                                        </TableCell>
                                        <TableCell>
                                            {formatLimit(plan.max_agents)}
                                        </TableCell>
                                        <TableCell>
                                            {formatLimit(plan.max_instances)}
                                        </TableCell>
                                        <TableCell>
                                            {plan.max_storage_mb !== null
                                                ? `${plan.max_storage_mb} MB`
                                                : '∞'}
                                        </TableCell>
                                        <TableCell>
                                            {plan.is_default ? (
                                                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                                                    {t(
                                                        'superAdmin.plans.table.status.default',
                                                    )}
                                                </span>
                                            ) : null}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    plan.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {plan.is_active
                                                    ? t(
                                                          'superAdmin.plans.table.status.active',
                                                      )
                                                    : t(
                                                          'superAdmin.plans.table.status.inactive',
                                                      )}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEditDialog(plan)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(plan)
                                                    }
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {plans.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={12}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            {t('superAdmin.plans.noPlans')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {t('superAdmin.plans.deleteConfirm')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {deletingPlan && deletingPlan.tenants_count > 0
                                    ? t('superAdmin.plans.deleteWarning', {
                                          count: deletingPlan.tenants_count,
                                      })
                                    : t('superAdmin.plans.deleteWarning', {
                                          count: 0,
                                      })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                {t('superAdmin.plans.cancelButton')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={form.processing}
                            >
                                {t('superAdmin.plans.deletePlan')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </SuperAdminLayout>
    );
}
