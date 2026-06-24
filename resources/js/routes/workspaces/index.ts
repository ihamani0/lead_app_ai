import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import agents from './agents'
import leads from './leads'
import wizard from './wizard'
import instances from './instances'
import media from './media'
import reports from './reports'
import knowledge from './knowledge'
import faqs from './faqs'
import bibliotheque from './bibliotheque'
import members from './members'
/**
* @see \App\Http\Controllers\Api\WorkspaceStatsController::stats
* @see app/Http/Controllers/Api/WorkspaceStatsController.php:13
* @route '/workspaces/stats'
*/
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/workspaces/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\WorkspaceStatsController::stats
* @see app/Http/Controllers/Api/WorkspaceStatsController.php:13
* @route '/workspaces/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WorkspaceStatsController::stats
* @see app/Http/Controllers/Api/WorkspaceStatsController.php:13
* @route '/workspaces/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\WorkspaceStatsController::stats
* @see app/Http/Controllers/Api/WorkspaceStatsController.php:13
* @route '/workspaces/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:20
* @route '/workspaces/{slug}/dashboard'
*/
export const dashboard = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(args, options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:20
* @route '/workspaces/{slug}/dashboard'
*/
dashboard.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return dashboard.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:20
* @route '/workspaces/{slug}/dashboard'
*/
dashboard.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:20
* @route '/workspaces/{slug}/dashboard'
*/
dashboard.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(args, options),
    method: 'head',
})

const workspaces = {
    agents: Object.assign(agents, agents),
    stats: Object.assign(stats, stats),
    dashboard: Object.assign(dashboard, dashboard),
    leads: Object.assign(leads, leads),
    wizard: Object.assign(wizard, wizard),
    instances: Object.assign(instances, instances),
    media: Object.assign(media, media),
    reports: Object.assign(reports, reports),
    knowledge: Object.assign(knowledge, knowledge),
    faqs: Object.assign(faqs, faqs),
    bibliotheque: Object.assign(bibliotheque, bibliotheque),
    members: Object.assign(members, members),
}

export default workspaces