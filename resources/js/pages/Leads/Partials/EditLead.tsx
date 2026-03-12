import { useForm } from '@inertiajs/react';
import { Edit2, Loader2 } from 'lucide-react';
import { useState } from 'react';
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
import { update } from '@/routes/leads';
import type { Lead } from '@/types';

export default function EditLead({ lead }: { lead: Lead }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        temperature: string;
        status: string;
    }>({
        name: lead.name || '',
        status: lead.status || 'NEW',
        temperature: lead.temperature || 'COLD',
    });

    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();
        put(update(lead.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    };

    // Reset form to actual lead data when modal opens
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setData({
                name: lead.name || '',
                status: lead.status || 'NEW',
                temperature: lead.temperature || 'COLD',
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    title="Edit Lead"
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Edit Lead</DialogTitle>
                        <DialogDescription>
                            Update contact details and sales pipeline status.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. John Doe"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Status Field */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Pipeline Status</Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                <option value="NEW">New</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="QUALIFIED">Qualified</option>
                                <option value="WON">Closed - Won</option>
                                <option value="LOST">Closed - Lost</option>
                            </select>
                            {errors.status && (
                                <p className="text-xs text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Temperature Field */}
                        <div className="space-y-2">
                            <Label htmlFor="temperature">
                                Lead Temperature
                            </Label>
                            <select
                                id="temperature"
                                value={data.temperature}
                                onChange={(e) =>
                                    setData('temperature', e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                <option value="HOT">Hot </option>
                                <option value="WARM">Warm </option>
                                <option value="COLD">Cold </option>
                            </select>
                            {errors.temperature && (
                                <p className="text-xs text-red-500">
                                    {errors.temperature}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
