import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import workspaces from '@/routes/workspaces';
import type { Faq } from '../types';

interface FaqFormPanelProps {
    faq: Faq | null;
    onClose: () => void;
}

const CATEGORIES = [
    'price',
    'location',
    'process',
    'finance',
    'technical',
    'general',
];

export function FaqFormPanel({ faq, onClose }: FaqFormPanelProps) {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace();
    const isEditing = !!faq;

    const { data, setData, post, put, processing, errors } = useForm({
        question: faq?.question || '',
        answer: faq?.answer || '',
        category: faq?.category || '',
        is_active: faq?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const slug = activeWorkspace!.slug;

        if (isEditing) {
            put(workspaces.faqs.update({ slug, faq: faq!.id }).url, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => onClose(),
            });
        } else {
            post(workspaces.faqs.store({ slug }).url, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="space-y-2">
                <Label htmlFor="question">
                    {t('bibliotheque.faq.form.question')}
                </Label>
                <Input
                    id="question"
                    value={data.question}
                    onChange={(e) => setData('question', e.target.value)}
                    placeholder="e.g., What is the price per m²?"
                />
                {errors.question && (
                    <p className="text-xs text-red-500">{errors.question}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="answer">
                    {t('bibliotheque.faq.form.answer')}
                </Label>
                <Textarea
                    id="answer"
                    value={data.answer}
                    onChange={(e) => setData('answer', e.target.value)}
                    rows={4}
                    placeholder="Write the AI's response..."
                />
                {errors.answer && (
                    <p className="text-xs text-red-500">{errors.answer}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">
                    {t('bibliotheque.faq.form.category')}
                </Label>
                <Select
                    value={data.category}
                    onValueChange={(value) => setData('category', value)}
                >
                    <SelectTrigger id="category">
                        <SelectValue
                            placeholder={t(
                                'bibliotheque.faq.form.categoryPlaceholder',
                            )}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {t(`bibliotheque.faq.categories.${cat}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="is_active" className="text-sm font-normal">
                    {t('bibliotheque.faq.form.enable')}
                </Label>
                <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                />
            </div>

            <div className="flex gap-2 pt-2">
                <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={processing}
                >
                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEditing
                        ? t('bibliotheque.faq.form.update')
                        : t('bibliotheque.faq.form.save')}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                    {t('bibliotheque.faq.form.cancel')}
                </Button>
            </div>
        </form>
    );
}
