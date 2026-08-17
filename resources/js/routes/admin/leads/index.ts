import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminLeadController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminLeadController.php:13
* @route '/super-admin/leads'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/leads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminLeadController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminLeadController.php:13
* @route '/super-admin/leads'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminLeadController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminLeadController.php:13
* @route '/super-admin/leads'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminLeadController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminLeadController.php:13
* @route '/super-admin/leads'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminLeadController::exportMethod
* @see app/Http/Controllers/SuperAdmin/SuperAdminLeadController.php:54
* @route '/super-admin/leads/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/super-admin/leads/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminLeadController::exportMethod
* @see app/Http/Controllers/SuperAdmin/SuperAdminLeadController.php:54
* @route '/super-admin/leads/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminLeadController::exportMethod
* @see app/Http/Controllers/SuperAdmin/SuperAdminLeadController.php:54
* @route '/super-admin/leads/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminLeadController::exportMethod
* @see app/Http/Controllers/SuperAdmin/SuperAdminLeadController.php:54
* @route '/super-admin/leads/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

const leads = {
    index: Object.assign(index, index),
    export: Object.assign(exportMethod, exportMethod),
}

export default leads