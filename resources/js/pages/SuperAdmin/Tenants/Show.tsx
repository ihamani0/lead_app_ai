import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { Tenant } from '@/types';
import type { PageProps } from '@/types';

type ShowProps = PageProps & {
    tenant: Tenant & {
        users: Array<{ id: string; name: string; email: string; role: string }>;
    };
};

export default function Show({ tenant }: ShowProps) {
    const { data, setData, post, processing, reset } = useForm({
        type: 'purchase',
        dollar_amount: '',
        description: '',
    });

    const tokensPerDollar = 833333;
    const calculatedTokens = data.dollar_amount ? Math.floor(parseFloat(data.dollar_amount) * tokensPerDollar) : 0;

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/super-admin/tenants/${tenant.slug}/add-tokens`, {
            onSuccess: () => reset(),
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p className="text-lg">{tenant.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                    <p className="text-lg">{tenant.slug}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                                    <p className="text-lg capitalize">{tenant.plan}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
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

                            <div className="rounded-lg bg-muted p-4">
                                <p className="text-sm font-medium text-muted-foreground">Token Balance</p>
                                <p className="text-3xl font-bold">{formatNumber(tenant.token_balance || 0)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add Tokens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Transaction Type</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="purchase">Purchase</SelectItem>
                                            <SelectItem value="bonus">Bonus</SelectItem>
                                            <SelectItem value="adjustment">Adjustment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dollar_amount">Dollar Amount ($)</Label>
                                    <Input
                                        id="dollar_amount"
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        value={data.dollar_amount}
                                        onChange={(e) => setData('dollar_amount', e.target.value)}
                                        placeholder="30.00"
                                        required
                                    />
                                    {calculatedTokens > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            = {formatNumber(calculatedTokens)} tokens
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Payment via bank transfer"
                                    />
                                </div>

                                <Button type="submit" disabled={processing || !data.dollar_amount}>
                                    {processing ? 'Adding...' : 'Add Tokens'}
                                </Button>
                            </form>

                            <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                                <p className="font-medium">Token Rate:</p>
                                <p>$1 = {formatNumber(tokensPerDollar)} tokens</p>
                                <p>$10 = {formatNumber(tokensPerDollar * 10)} tokens</p>
                                <p>$30 = {formatNumber(tokensPerDollar * 30)} tokens</p>
                                <p>$50 = {formatNumber(tokensPerDollar * 50)} tokens</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Users ({tenant.users.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {tenant.users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
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
                                    <p className="text-center text-muted-foreground">No users found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
