import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\TokenUsageController::index
* @see app/Http/Controllers/SuperAdmin/TokenUsageController.php:13
* @route '/super-admin/token-usage'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/token-usage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\TokenUsageController::index
* @see app/Http/Controllers/SuperAdmin/TokenUsageController.php:13
* @route '/super-admin/token-usage'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\TokenUsageController::index
* @see app/Http/Controllers/SuperAdmin/TokenUsageController.php:13
* @route '/super-admin/token-usage'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\TokenUsageController::index
* @see app/Http/Controllers/SuperAdmin/TokenUsageController.php:13
* @route '/super-admin/token-usage'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const tokenUsage = {
    index: Object.assign(index, index),
}

export default tokenUsage