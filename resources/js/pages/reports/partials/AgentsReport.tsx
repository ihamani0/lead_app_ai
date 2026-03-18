import { Bot, TrendingUp, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    return (
        <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
                <p className="font-medium">{agent.name}</p>
                <p className="text-sm text-muted-foreground">
                    {agent.instance_name || 'No instance'}
                </p>
            </div>
            <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                {agent.is_active ? 'Active' : 'Inactive'}
            </Badge>
        </div>
    );
}

export function AgentsReport({ data }: AgentsReportProps) {
    if (!data) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
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

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    title="Total Agents"
                    value={summary.total}
                    icon={Bot}
                />
                <SummaryCard
                    title="Active Agents"
                    value={summary.active}
                    icon={TrendingUp}
                />
                <SummaryCard
                    title="Inactive Agents"
                    value={summary.inactive}
                    icon={BarChart3}
                />
            </div>

            {/* Chart */}
            {statusData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Agent Status
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
                                    label={({ name, percent }: any) =>
                                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
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

            {/* All Agents List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">All Agents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {agents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                        {agents.length === 0 && (
                            <p className="text-muted-foreground">
                                No agents configured
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AgentsReport;
