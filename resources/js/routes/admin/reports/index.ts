import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminReportController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminReportController.php:14
* @route '/super-admin/reports'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminReportController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminReportController.php:14
* @route '/super-admin/reports'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminReportController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminReportController.php:14
* @route '/super-admin/reports'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminReportController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminReportController.php:14
* @route '/super-admin/reports'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const reports = {
    index: Object.assign(index, index),
}

export default reports