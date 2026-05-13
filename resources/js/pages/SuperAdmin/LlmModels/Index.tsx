import { Head, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';

interface LlmModel {
    id: string;
    name: string;
    display_name: string;
    provider: string;
    input_rate_per_million_millicents: number;
    output_rate_per_million_millicents: number;
    cost_input_per_million_millicents: number;
    cost_output_per_million_millicents: number;
    is_active: boolean;
    created_at: string;
}

interface PageProps {
    models: LlmModel[];
}

export default function Index({ models }: PageProps) {
    const { t } = useTranslation();

    const createForm = useForm({
        name: '',
        display_name: '',
        provider: '',
        input_rate_cents: 24,
        output_rate_cents: 38,
        cost_input_cents: 14,
        cost_output_cents: 28,
    });

    return (
        <AppLayout>
            <Head title="LLM Models" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold lg:text-4xl">
                        LLM Models
                    </h1>
                </div>

                <Separator />

                {/* Models Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Available Models</CardTitle>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Model
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Add New LLM Model
                                        </DialogTitle>
                                        <DialogDescription>
                                            Configure pricing for a new AI
                                            model.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            createForm.post(
                                                '/super-admin/models',
                                            );
                                        }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Internal Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={createForm.data.name}
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="deepseek"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="provider">
                                                    Provider
                                                </Label>
                                                <Input
                                                    id="provider"
                                                    value={
                                                        createForm.data.provider
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            'provider',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="deepseek"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="display_name">
                                                Display Name
                                            </Label>
                                            <Input
                                                id="display_name"
                                                value={
                                                    createForm.data.display_name
                                                }
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        'display_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="DeepSeek"
                                            />
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <Label className="text-base font-semibold">
                                                Your Pricing (cents per 1M
                                                tokens)
                                            </Label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="input_rate_cents">
                                                    Input Rate (cents)
                                                </Label>
                                                <Input
                                                    id="input_rate_cents"
                                                    type="number"
                                                    value={
                                                        createForm.data
                                                            .input_rate_cents
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            'input_rate_cents',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="output_rate_cents">
                                                    Output Rate (cents)
                                                </Label>
                                                <Input
                                                    id="output_rate_cents"
                                                    type="number"
                                                    value={
                                                        createForm.data
                                                            .output_rate_cents
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            'output_rate_cents',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-base font-semibold">
                                                Your Cost (cents per 1M tokens)
                                            </Label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="cost_input_cents">
                                                    Input Cost (cents)
                                                </Label>
                                                <Input
                                                    id="cost_input_cents"
                                                    type="number"
                                                    value={
                                                        createForm.data
                                                            .cost_input_cents
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            'cost_input_cents',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cost_output_cents">
                                                    Output Cost (cents)
                                                </Label>
                                                <Input
                                                    id="cost_output_cents"
                                                    type="number"
                                                    value={
                                                        createForm.data
                                                            .cost_output_cents
                                                    }
                                                    onChange={(e) =>
                                                        createForm.setData(
                                                            'cost_output_cents',
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-4">
                                            <Button type="submit">
                                                Create Model
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Your Input</TableHead>
                                    <TableHead>Your Output</TableHead>
                                    <TableHead>Cost Input</TableHead>
                                    <TableHead>Cost Output</TableHead>
                                    <TableHead>Margin</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {models.map((model) => (
                                    <TableRow key={model.id}>
                                        <TableCell className="font-medium">
                                            {model.display_name}
                                            <br />
                                            <span className="text-xs text-muted-foreground">
                                                {model.name}
                                            </span>
                                        </TableCell>
                                        <TableCell>{model.provider}</TableCell>
                                        <TableCell>
                                            $
                                            {(
                                                model.input_rate_per_million_millicents /
                                                100000
                                            ).toFixed(2)}
                                            /M
                                        </TableCell>
                                        <TableCell>
                                            $
                                            {(
                                                model.output_rate_per_million_millicents /
                                                100000
                                            ).toFixed(2)}
                                            /M
                                        </TableCell>
                                        <TableCell>
                                            $
                                            {(
                                                model.cost_input_per_million_millicents /
                                                100000
                                            ).toFixed(2)}
                                            /M
                                        </TableCell>
                                        <TableCell>
                                            $
                                            {(
                                                model.cost_output_per_million_millicents /
                                                100000
                                            ).toFixed(2)}
                                            /M
                                        </TableCell>
                                        <TableCell className="text-green-600">
                                            +$
                                            {(
                                                (model.input_rate_per_million_millicents -
                                                    model.cost_input_per_million_millicents) /
                                                100000
                                            ).toFixed(2)}
                                            /M
                                            <br />
                                            <span className="text-xs">
                                                +$
                                                {(
                                                    (model.output_rate_per_million_millicents -
                                                        model.cost_output_per_million_millicents) /
                                                    100000
                                                ).toFixed(2)}
                                                /M
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={
                                                    model.is_active
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }
                                            >
                                                {model.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
