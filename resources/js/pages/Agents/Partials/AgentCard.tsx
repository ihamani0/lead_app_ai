import { Bot, Phone, FileText, Copy, Unlink, Settings, Trash2, ArrowLeftRight, Loader2, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { type AgentConfig } from '@/types';

interface AgentCardProps {
    agent: AgentConfig;
    canManage: boolean;
    onUnlink: (id: string) => void;
    onOpenLink: (agent: AgentConfig) => void;
    onOpenConfig: (id: string) => void;
    onDelete: (id: string) => void;
    onClone: (id: string) => void;
    cloningId: string | null;
}

export function AgentCard({
    agent,
    canManage,
    onUnlink,
    onOpenLink,
    onOpenConfig,
    onDelete,
    onClone,
    cloningId,
}: AgentCardProps) {
    const isLinked = agent.evolution_instance_id !== null;
    const isConnected = isLinked && agent.instance?.status === 'connected';
    const isActive = agent.is_active && isConnected;

    return (
        <Card
            className="group relative overflow-hidden bg-card border border-zinc-100 shadow-xs transition-all duration-300 rounded-2xl dark:border-zinc-800/80"
            data-tour="agent-card"
        >
            <AgentCardHeader agent={agent} isActive={isActive} isLinked={isLinked} />

            <CardContent className="space-y-4 px-5 pb-5">
                <AgentInfoHub agent={agent} isLinked={isLinked} />
                <AgentCardFooter 
                    agent={agent}
                    isLinked={isLinked}
                    canManage={canManage}
                    onUnlink={onUnlink}
                    onOpenLink={onOpenLink}
                    onOpenConfig={onOpenConfig}
                    onDelete={onDelete}
                    onClone={onClone}
                    cloningId={cloningId}
                />
            </CardContent>
        </Card>
    );
}

/* ==========================================
   SUB-COMPONENT: HEADER
   ========================================== */
function AgentCardHeader({ agent, isActive, isLinked }: { agent: AgentConfig; isActive: boolean; isLinked: boolean }) {
    const { t } = useTranslation();

    return (
        <CardHeader className="pb-4 pt-5 px-5">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900">
                        <Bot className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div className="space-y-0.5">
                        <CardTitle className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {agent.name || t('agents.assistant')}
                        </CardTitle>
                        <Badge
                            variant="outline"
                            className="h-5 rounded-md border-zinc-200/60 px-1.5 text-[10px] font-medium tracking-wide font-mono text-zinc-400 dark:border-zinc-800 dark:text-zinc-500"
                        >
                            {'MyIACore'}
                        </Badge>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 dark:bg-zinc-950">
                    <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]' : isLinked ? 'bg-amber-400' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                    <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                        {isLinked
                            ? agent.is_active
                                ? t('agents.status.running')
                                : t('agents.status.paused')
                            : t('agents.status.noInstance')}
                    </span>
                </div>
            </div>
        </CardHeader>
    );
}

/* ==========================================
   SUB-COMPONENT: MODERN METADATA HUB
   ========================================== */
function AgentInfoHub({ agent, isLinked }: { agent: AgentConfig; isLinked: boolean }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/40 p-2.5 dark:border-zinc-800/30 dark:bg-zinc-900/10">
            <div className="flex items-center gap-6">
                {/* Channel Details */}
                <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">WhatsApp</span>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {isLinked && agent.instance?.phone_number ? `+${agent.instance.phone_number}` : '---'}
                        </span>
                    </div>
                </div>

                {/* Spatial Divider Line */}
                <div className="h-6 w-px bg-zinc-200/50 dark:bg-zinc-800" />

                {/* Resource Assets Details */}
                <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Documents</span>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {agent?.knowledge_bases_count || 0} Doc{agent?.knowledge_bases_count !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
                
                <div className="h-6 w-px bg-zinc-200/50 dark:bg-zinc-800" />

                {/* Resource Assets Details */}
                <div className="flex items-center gap-2">
                    <Image className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Media</span>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {agent?.media_asset_count || 0} media{agent?.media_asset_count !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ==========================================
   SUB-COMPONENT: ACTION BAR CONTROL PANEL
   ========================================== */
function AgentCardFooter({
    agent,
    isLinked,
    canManage,
    onUnlink,
    onOpenLink,
    onOpenConfig,
    onDelete,
    onClone,
    cloningId,
}: Omit<AgentCardProps, 'onUpdate'> & { isLinked: boolean }) {
    return (
        <div className="pt-3 w-full flex items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800/50 flex-wrap">
            <div className="flex gap-2">
                {isLinked && canManage && (
                    <>
                        <button 
                            onClick={() => onUnlink(agent.id)}
                            className="flex flex-col items-center gap-1.5 px-4 py-2 min-w-[85px] bg-zinc-50 dark:bg-zinc-900 rounded-xl text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <Unlink className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                            Disconnect
                        </button>
                        <button 
                            onClick={() => onOpenLink(agent)}
                            className="flex flex-col items-center gap-1.5 px-4 py-2 min-w-[85px] bg-zinc-50 dark:bg-zinc-900 rounded-xl text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <ArrowLeftRight className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                            Change
                        </button>
                    </>
                )}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-1">
                <button 
                    onClick={() => onClone(agent.id)}
                    disabled={cloningId === agent.id}
                    className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-[11px] font-medium text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-950/20 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                    {cloningId === agent.id ? (
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                        <Copy className="h-4.5 w-4.5" />
                    )}
                    Duplicate
                </button>
                <button 
                    onClick={() => onOpenConfig(agent.id)}
                    className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-[11px] font-medium text-green-700 hover:bg-green-100 dark:hover:bg-green-950/20 transition-colors"
                >
                    <Settings className="h-4.5 w-4.5" />
                    Configuration
                </button>

                {canManage && (
                    <button 
                        onClick={() => onDelete(agent.id)}
                        className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-[11px] font-medium text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors"
                    >
                        <Trash2 className="h-4.5 w-4.5" />
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}



