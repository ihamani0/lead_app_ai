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
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import admin from '@/routes/admin';

interface CreditPackage {
    id: number;
    name: string;
    description: string | null;
    price_millicents: number;
    credit_millicents: number;
    paddle_price_id: string | null;
    is_active: boolean;
    created_at: string;
}

interface PageProps {
    packages: CreditPackage[];
}

const formatPrice = (millicents: number): string => {
    return `$${(millicents / 100_000).toFixed(2)}`;
};

export default function Index({ packages }: PageProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingPackage, setDeletingPackage] = useState<CreditPackage | null>(null);

    const isEditing = editingPackage !== null;

    const form = useForm({
        name: '',
        description: '',
        price_millicents: '',
        credit_millicents: '',
        paddle_price_id: '',
        is_active: false,
    });

    const openCreate = () => {
        setEditingPackage(null);
        form.reset();
        setDialogOpen(true);
    };

    const openEdit = (pkg: CreditPackage) => {
        setEditingPackage(pkg);
        form.setData({
            name: pkg.name,
            description: pkg.description ?? '',
            price_millicents: String(pkg.price_millicents),
            credit_millicents: String(pkg.credit_millicents),
            paddle_price_id: pkg.paddle_price_id ?? '',
            is_active: pkg.is_active,
        });
        setDialogOpen(true);
    };

    const submit = () => {
        if (isEditing && editingPackage) {
            form.post(admin.creditPackages.update(editingPackage.id).url, {
                preserveState: true,
                onSuccess: () => setDialogOpen(false),
            });
        } else {
            form.post(admin.creditPackages.store().url, {
                preserveState: true,
                onSuccess: () => {
                    setDialogOpen(false);
                    form.reset();
                },
            });
        }
    };

    const confirmDelete = (pkg: CreditPackage) => {
        setDeletingPackage(pkg);
        setDeleteOpen(true);
    };

    const executeDelete = () => {
        if (!deletingPackage) return;
        form.delete(admin.creditPackages.destroy(deletingPackage.id).url, {
            preserveState: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setDeletingPackage(null);
            },
        });
    };

    return (
        <SuperAdminLayout>
            <Head title="Credit Packages" />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Credit Packages</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate}>
                            <Plus className="mr-2 size-4" />
                            New Package
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {isEditing ? 'Edit Package' : 'New Package'}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditing
                                    ? 'Update the credit package details'
                                    : 'Create a new credit package for users to purchase'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    placeholder="Starter Pack"
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="500 credits for $5"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price_millicents">
                                        Price (millicents)
                                    </Label>
                                    <Input
                                        id="price_millicents"
                                        type="number"
                                        value={form.data.price_millicents}
                                        onChange={(e) =>
                                            form.setData(
                                                'price_millicents',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="500000"
                                    />
                                    {form.data.price_millicents && (
                                        <p className="text-xs text-muted-foreground">
                                            ≈ {formatPrice(Number(form.data.price_millicents))}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="credit_millicents">
                                        Credit (millicents)
                                    </Label>
                                    <Input
                                        id="credit_millicents"
                                        type="number"
                                        value={form.data.credit_millicents}
                                        onChange={(e) =>
                                            form.setData(
                                                'credit_millicents',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="500000"
                                    />
                                    {form.data.credit_millicents && (
                                        <p className="text-xs text-muted-foreground">
                                            ≈ {formatPrice(Number(form.data.credit_millicents))}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="paddle_price_id">
                                    Paddle Price ID
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

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="is_active"
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) =>
                                        form.setData('is_active', checked)
                                    }
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={submit} disabled={form.processing}>
                                {isEditing ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Packages</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Credit</TableHead>
                                <TableHead>Paddle ID</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {packages.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground py-8"
                                    >
                                        No credit packages yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {packages.map((pkg) => (
                                <TableRow key={pkg.id}>
                                    <TableCell className="font-medium">
                                        {pkg.name}
                                    </TableCell>
                                    <TableCell>
                                        {formatPrice(pkg.price_millicents)}
                                    </TableCell>
                                    <TableCell>
                                        {formatPrice(pkg.credit_millicents)}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {pkg.paddle_price_id ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        {pkg.is_active ? 'Yes' : 'No'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(pkg)}
                                            >
                                                <Edit className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    confirmDelete(pkg)
                                                }
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Package?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingPackage?.name}"?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SuperAdminLayout>
    );
}
