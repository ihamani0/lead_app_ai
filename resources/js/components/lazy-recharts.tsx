import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

const LazyPieChart = lazy(() =>
    import('recharts').then((module) => ({
        default: module.PieChart,
    })),
);

const LazyPie = lazy(() =>
    import('recharts').then((module) => ({
        default: module.Pie,
    })),
);

const LazyCell = lazy(() =>
    import('recharts').then((module) => ({
        default: module.Cell,
    })),
);

const LazyResponsiveContainer = lazy(() =>
    import('recharts').then((module) => ({
        default: module.ResponsiveContainer,
    })),
);

const LazyTooltip = lazy(() =>
    import('recharts').then((module) => ({
        default: module.Tooltip,
    })),
);

const LazyLegend = lazy(() =>
    import('recharts').then((module) => ({
        default: module.Legend,
    })),
);

function ChartSkeleton() {
    return (
        <div className="flex h-[300px] items-center justify-center">
            <Spinner />
        </div>
    );
}

interface LazyChartProps {
    children: React.ReactNode;
}

export function LazyChart({ children }: LazyChartProps) {
    return <Suspense fallback={<ChartSkeleton />}>{children}</Suspense>;
}

export {
    LazyPieChart as PieChart,
    LazyPie as Pie,
    LazyCell as Cell,
    LazyResponsiveContainer as ResponsiveContainer,
    LazyTooltip as Tooltip,
    LazyLegend as Legend,
};
