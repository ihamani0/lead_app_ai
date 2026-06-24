import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminDashboardController::dashboard
* @see app/Http/Controllers/SuperAdmin/SuperAdminDashboardController.php:13
* @route '/super-admin/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/super-admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminDashboardController::dashboard
* @see app/Http/Controllers/SuperAdmin/SuperAdminDashboardController.php:13
* @route '/super-admin/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminDashboardController::dashboard
* @see app/Http/Controllers/SuperAdmin/SuperAdminDashboardController.php:13
* @route '/super-admin/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminDashboardController::dashboard
* @see app/Http/Controllers/SuperAdmin/SuperAdminDashboardController.php:13
* @route '/super-admin/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

const superAdmin = {
    dashboard: Object.assign(dashboard, dashboard),
}

export default superAdmin