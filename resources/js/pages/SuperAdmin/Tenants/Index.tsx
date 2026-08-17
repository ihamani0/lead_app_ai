import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
import type { Tenant } from '@/types';

type IndexProps = SharedPageProps & {
    tenants: Tenant[];
};

export default function Index({ tenants }: IndexProps) {
    const { t } = useTranslation();

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    return (
        <SuperAdminLayout>
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {t('superAdmin.tenants.list.title')}
                    </h1>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {t(
                                        'superAdmin.tenants.list.table.headers.name',
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        'superAdmin.tenants.list.table.headers.slug',
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        'superAdmin.tenants.list.table.headers.plan',
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        'superAdmin.tenants.list.table.headers.status',
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        'superAdmin.tenants.list.table.headers.tokenBalance',
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        'superAdmin.tenants.list.table.headers.users',
                                    )}
                                </TableHead>
                                <TableHead>
                                    {t(
                                        'superAdmin.tenants.list.table.headers.actions',
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tenants.map((tenant) => (
                                <TableRow key={tenant.id}>
                                    <TableCell className="font-medium">
                                        {tenant.name}
                                    </TableCell>
                                    <TableCell>{tenant.slug}</TableCell>
                                    <TableCell>
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                            {tenant.plan?.name ?? tenant.plan}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                tenant.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {tenant.is_active
                                                ? t(
                                                      'superAdmin.tenants.list.status.active',
                                                  )
                                                : t(
                                                      'superAdmin.tenants.list.status.inactive',
                                                  )}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono">
                                            {formatNumber(
                                                tenant.token_balance || 0,
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {tenant.users_count || 0}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link
                                                href={
                                                    admin.tenant.show(tenant.id)
                                                        .url
                                                }
                                            >
                                                {t(
                                                    'superAdmin.tenants.list.table.actions.manage',
                                                )}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {tenants.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center"
                                    >
                                        {t(
                                            'superAdmin.tenants.list.table.empty',
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
