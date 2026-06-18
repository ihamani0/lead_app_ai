import type { Step } from 'react-joyride';
import type { TourConfig } from '@/types/tour';

const dashboardSteps: Step[] = [
    {
        target: '[data-tour="sidebar-dashboard"]',
        content: 'tour.sidebar_dashboard',
        placement: 'right',
        id: 'sidebar-dashboard',
    },
    {
        target: '[data-tour="stats-leads"]',
        content: 'tour.stats_leads',
        placement: 'bottom',
        id: 'stats-leads',
    },
    {
        target: '[data-tour="stats-instances"]',
        content: 'tour.stats_instances',
        placement: 'bottom',
        id: 'stats-instances',
    },
    {
        target: '[data-tour="token-balance"]',
        content: 'tour.token_balance',
        placement: 'left',
        id: 'token-balance',
    },
    {
        target: '[data-tour="recent-leads"]',
        content: 'tour.recent_leads',
        placement: 'top',
        id: 'recent-leads',
    },
];

const leadsSteps: Step[] = [
    {
        target: '[data-tour="leads-search"]',
        content: 'tour.leads_search',
        placement: 'bottom',
        id: 'leads-search',
    },
    {
        target: '[data-tour="leads-table"]',
        content: 'tour.leads_table',
        placement: 'bottom',
        id: 'leads-table',
    },
    {
        target: '[data-tour="leads-filters"]',
        content: 'tour.leads_filters',
        placement: 'bottom',
        id: 'leads-filters',
    },
    {
        target: '[data-tour="leads-actions"]',
        content: 'tour.leads_actions',
        placement: 'bottom',
        id: 'leads-actions',
    },
];

export const tours: TourConfig[] = [
    {
        name: 'dashboard',
        route: 'dashboard',
        steps: dashboardSteps,
    },
    {
        name: 'leads',
        route: 'leads.index',
        steps: leadsSteps,
    },
    {
        name: 'instances',
        route: 'profile',
        steps: [
            {
                target: '[data-tour="instances-header"]',
                content: 'tour.instances_header',
                placement: 'bottom',
                id: 'instances-header',
            },
            {
                target: '[data-tour="create-instance"]',
                content: 'tour.create_instance',
                placement: 'left',
                id: 'create-instance',
            },
            {
                target: '[data-tour="instance-card"]',
                content: 'tour.instance_card',
                placement: 'top',
                id: 'instance-card',
            },
        ],
    },
    {
        name: 'agents',
        route: 'agents.index',
        steps: [
            {
                target: '[data-tour="agents-create"]',
                content: 'tour.agents_create',
                placement: 'left',
                id: 'agents-create',
            },
            {
                target: '[data-tour="agent-card"]',
                content: 'tour.agent_card',
                placement: 'top',
                id: 'agent-card',
            },
        ],
    },
    {
        name: 'settings',
        route: 'settings.profile',
        steps: [
            {
                target: '[data-tour="settings-nav"]',
                content: 'tour.settings_nav',
                placement: 'right',
                id: 'settings-nav',
            },
        ],
    },
];

export function getTourForRoute(routeName: string): TourConfig | undefined {
    return tours.find((tour) => tour.route === routeName);
}
