import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'roles' | 'settings';

interface Tab {
    id: TabType;
    label: string;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function TabNavigation({
    tabs,
    activeTab,
    onTabChange,
}: TabNavigationProps) {
    return (
        <div className="space-y-4">
            {/* Mobile: Horizontal scroll */}
            <div className="flex w-full gap-2 overflow-x-auto pb-2 md:justify-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            'rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                            activeTab === tab.id
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <Separator className="hidden md:block" />
        </div>
    );
}
