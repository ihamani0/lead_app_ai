import { Bot, TrendingUp, BarChart3, Coins } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { getChartColor } from '@/lib/utils';
import type { AgentsReportData, AgentData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface AgentsReportProps {
    data: AgentsReportData | null;
}

interface AgentCardProps {
    agent: AgentData;
}

function AgentCard({ agent }: AgentCardProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex-1">
                <p className="font-medium">{agent.name}</p>
                <p className="text-sm text-muted-foreground">
                    {agent.instance_name ||
                        agent.display_name ||
                        t('reports.agents.noInstance')}
                </p>
            </div>
            <div className="flex items-center gap-4">
                {agent.total_tokens > 0 && (
                    <div className="text-right">
                        <p className="text-sm font-medium">
                            {agent.total_tokens >= 1_000_000
                                ? `${(agent.total_tokens / 1_000_000).toFixed(1)}M`
                                : agent.total_tokens >= 1_000
                                  ? `${(agent.total_tokens / 1_000).toFixed(1)}K`
                                  : agent.total_tokens}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            ${agent.total_cost.toFixed(2)}
                        </p>
                    </div>
                )}
                <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                    {agent.is_active
                        ? t('reports.agents.active')
                        : t('reports.agents.inactive')}
                </Badge>
            </div>
        </div>
    );
}

export function AgentsReport({ data }: AgentsReportProps) {
    const { t } = useTranslation();

    if (!data) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">
                    {t('reports.noData')}
                </div>
            </div>
        );
    }

    const { summary, byStatus, agents } = data;

    const statusData = Object.entries(byStatus || {}).map(
        ([name, value], index) => ({
            name,
            value,
            color: getChartColor(index + 1),
        }),
    );

    const agentsWithTokens = agents.filter((a) => a.total_tokens > 0);
    const tokenChartData = agentsWithTokens
        .sort((a, b) => b.total_tokens - a.total_tokens)
        .map((a) => ({
            name: a.name,
            tokens: a.total_tokens,
            cost: a.total_cost,
        }));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard
                    title={t('reports.agents.summary.totalAgents')}
                    value={summary.total}
                    icon={Bot}
                />
                <SummaryCard
                    title={t('reports.agents.summary.activeAgents')}
                    value={summary.active}
                    icon={TrendingUp}
                />
                <SummaryCard
                    title={t('reports.agents.summary.inactiveAgents')}
                    value={summary.inactive}
                    icon={BarChart3}
                />
                <SummaryCard
                    title={t('reports.agents.summary.totalTokens')}
                    value={agents.reduce((sum, a) => sum + a.total_tokens, 0)}
                    icon={Coins}
                    description={t('reports.agents.summary.allTimeTokens')}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Pie Chart - Status */}
                {statusData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm md:text-base">
                                {t('reports.agents.charts.agentStatus')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({
                                            name,
                                            percent,
                                        }: {
                                            name?: string;
                                            percent?: number;
                                        }) =>
                                            `${name ?? ''} ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Bar Chart - Token Usage */}
                {tokenChartData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm md:text-base">
                                {t('reports.agents.charts.tokenUsage')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={tokenChartData} layout="vertical">
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-muted"
                                    />
                                    <XAxis type="number" />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={100}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        formatter={(value, name) =>
                                            name === 'tokens'
                                                ? Number(value) >= 1_000_000
                                                  ? `${(Number(value) / 1_000_000).toFixed(1)}M tokens`
                                                  : Number(value) >= 1_000
                                                    ? `${(Number(value) / 1_000).toFixed(1)}K tokens`
                                                    : `${value} tokens`
                                                : `$${Number(value).toFixed(2)}`
                                        }
                                    />
                                    <Bar
                                        dataKey="tokens"
                                        fill="#8b5cf6"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* All Agents List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm md:text-base">
                        {t('reports.agents.list.allAgents')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {agents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                        {agents.length === 0 && (
                            <p className="text-muted-foreground">
                                {t('reports.agents.noAgents')}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AgentsReport;
