import { useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Chart from 'react-apexcharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

type ShowProps = SharedPageProps & {
    tenant: {
        id: string;
        name: string;
        slug: string;
        plan: string;
        is_active: boolean;
        credit_millicents: number;
        dollar_limit: number;
        is_low_credit: boolean;
        llm_model_id: string | null;
        llm_model?: {
            id: string;
            name: string;
            display_name: string;
        } | null;
        users: Array<{ id: string; name: string; email: string; role: string }>;
    };
    daily_usage?: Array<{
        date: string;
        total_tokens_used: number;
        input_tokens_used: number;
        output_tokens_used: number;
        input_cost_millicents: number;
        output_cost_millicents: number;
        total_cost_millicents: number;
        millicents_recharged: number;
        transaction_count: number;
    }>;
    transactions?: Array<{
        id: string;
        date: string;
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
        input_cost_millicents: number;
        output_cost_millicents: number;
        total_cost_millicents: number;
        type: string;
        reference_type: string | null;
        created_at: string;
    }>;
    available_models: Array<{
        id: string;
        name: string;
        display_name: string;
    }>;
};

export default function Show({
    tenant,
    daily_usage,
    transactions,
    available_models,
}: ShowProps) {
    const creditForm = useForm({
        type: 'purchase',
        dollar_amount: '',
        description: '',
    });

    const modelForm = useForm({
        llm_model_id: tenant.llm_model_id ?? '',
    });

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatCurrency = (millicents: number): string => {
        return `$${(millicents / 100_000).toFixed(2)}`;
    };

    const handleAddCredit = (e: React.SubmitEvent) => {
        e.preventDefault();
        creditForm.post(admin.tenant.addDollars(tenant.id).url, {
            onSuccess: () => creditForm.reset(),
        });
    };

    const handleUpdateModel = (e: React.SubmitEvent) => {
        e.preventDefault();
        modelForm.post(admin.tenant.updateModel(tenant.id).url, {
            onSuccess: () => {},
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">{tenant.name}</h1>
                    <p className="text-muted-foreground">{tenant.slug}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Tenant Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </p>
                                    <p className="text-lg">{tenant.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Slug
                                    </p>
                                    <p className="text-lg">{tenant.slug}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Plan
                                    </p>
                                    <p className="text-lg capitalize">
                                        {tenant.plan}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </p>
                                    <span
                                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                            tenant.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {tenant.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Credit Balance */}
                            <div
                                className={`rounded-lg p-4 ${
                                    tenant.is_low_credit
                                        ? 'bg-red-50 border border-red-200'
                                        : 'bg-muted'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {tenant.is_low_credit ? (
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Credit Balance
                                    </p>
                                </div>
                                <p className="text-3xl font-bold">
                                    ${((tenant.credit_millicents || 0) / 100_000).toFixed(2)}
                                </p>
                                {tenant.is_low_credit && (
                                    <p className="text-sm text-red-600">
                                        Below ${((tenant.dollar_limit || 0) / 100_000).toFixed(2)} threshold
                                    </p>
                                )}
                            </div>

                            {/* Model Selection */}
                            <form onSubmit={handleUpdateModel} className="space-y-2">
                                <Label>AI Model</Label>
                                <Select
                                    value={modelForm.data.llm_model_id}
                                    onValueChange={(value) =>
                                        modelForm.setData('llm_model_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">
                                            Default (DeepSeek)
                                        </SelectItem>
                                        {available_models.map((model) => (
                                            <SelectItem
                                                key={model.id}
                                                value={model.id}
                                            >
                                                {model.display_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                    disabled={modelForm.processing}
                                >
                                    Update Model
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Add Credit */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Credit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleAddCredit}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="type">
                                        Transaction Type
                                    </Label>
                                    <Select
                                        value={creditForm.data.type}
                                        onValueChange={(value) =>
                                            creditForm.setData('type', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="purchase">
                                                Purchase
                                            </SelectItem>
                                            <SelectItem value="bonus">
                                                Bonus
                                            </SelectItem>
                                            <SelectItem value="adjustment">
                                                Adjustment
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dollar_amount">
                                        Dollar Amount ($)
                                    </Label>
                                    <Input
                                        id="dollar_amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={creditForm.data.dollar_amount}
                                        onChange={(e) =>
                                            creditForm.setData(
                                                'dollar_amount',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="10.00"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description (Optional)
                                    </Label>
                                    <Input
                                        id="description"
                                        value={creditForm.data.description}
                                        onChange={(e) =>
                                            creditForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Payment via bank transfer"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={
                                        creditForm.processing || !creditForm.data.dollar_amount
                                    }
                                >
                                    {creditForm.processing
                                        ? 'Adding...'
                                        : 'Add Credit'}
                                </Button>
                            </form>

                            <Separator className="my-4" />

                            <div className="rounded-lg bg-muted p-3 text-sm">
                                <p className="font-medium">Quick Add:</p>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            creditForm.setData('dollar_amount', '10')
                                        }
                                    >
                                        $10
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            creditForm.setData('dollar_amount', '25')
                                        }
                                    >
                                        $25
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            creditForm.setData('dollar_amount', '50')
                                        }
                                    >
                                        $50
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            creditForm.setData('dollar_amount', '100')
                                        }
                                    >
                                        $100
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Users ({tenant.users.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {tenant.users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                user.role === 'admin'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : user.role === 'manager'
                                                      ? 'bg-purple-100 text-purple-800'
                                                      : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                                {tenant.users.length === 0 && (
                                    <p className="text-center text-muted-foreground">
                                        No users found.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Usage Chart */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                Daily Token Usage (Last 30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {daily_usage && daily_usage.length > 0 ? (
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'bar',
                                            toolbar: { show: false },
                                        },
                                        xaxis: {
                                            categories: daily_usage.map((d) =>
                                                new Date(
                                                    d.date,
                                                ).toLocaleDateString(),
                                            ),
                                        },
                                        yaxis: { title: { text: 'Tokens' } },
                                        colors: ['#3b82f6', '#10b981'],
                                        legend: { position: 'top' },
                                    }}
                                    series={[
                                        {
                                            name: 'Input Tokens',
                                            data: daily_usage.map(
                                                (d) => d.input_tokens_used,
                                            ),
                                        },
                                        {
                                            name: 'Output Tokens',
                                            data: daily_usage.map(
                                                (d) => d.output_tokens_used,
                                            ),
                                        },
                                    ]}
                                    type="bar"
                                    height={300}
                                />
                            ) : (
                                <p className="text-muted-foreground">
                                    No usage data yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Daily Usage Table */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                Daily Usage History (Last 30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {daily_usage && daily_usage.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Input</TableHead>
                                            <TableHead>Output</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Cost</TableHead>
                                            <TableHead>Recharged</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {daily_usage.map((day) => (
                                            <TableRow key={day.date}>
                                                <TableCell>
                                                    {new Date(
                                                        day.date,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {formatNumber(day.input_tokens_used)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatNumber(day.output_tokens_used)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatNumber(
                                                        day.total_tokens_used,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-red-600">
                                                    {day.total_cost_millicents / 100000}
                                                </TableCell>
                                                <TableCell className="text-green-600">
                                                    {day.millicents_recharged > 0
                                                        ? formatCurrency(
                                                              day.millicents_recharged,
                                                          )
                                                        : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">
                                    No usage data yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Per-Transaction History */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Recent Transactions (Last 50)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transactions && transactions.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Input</TableHead>
                                            <TableHead>Output</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Cost</TableHead>
                                            <TableHead>Reference</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((tx) => (
                                            <TableRow key={tx.id}>
                                                <TableCell>
                                                    {new Date(
                                                        tx.created_at,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={
                                                            tx.type ===
                                                            'deduction'
                                                                ? 'text-red-600'
                                                                : 'text-green-600'
                                                        }
                                                    >
                                                        {tx.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {formatNumber(tx.input_tokens)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatNumber(tx.output_tokens)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatNumber(tx.total_tokens)}
                                                </TableCell>
                                                <TableCell>
                                                    {tx.total_cost_millicents / 100000}
                                                </TableCell>
                                                <TableCell>
                                                    {tx.reference_type ?? 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">
                                    No transactions yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}