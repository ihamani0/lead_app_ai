import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\OpenRouterController::credits
* @see app/Http/Controllers/SuperAdmin/OpenRouterController.php:11
* @route '/super-admin/openrouter/credits'
*/
export const credits = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: credits.url(options),
    method: 'get',
})

credits.definition = {
    methods: ["get","head"],
    url: '/super-admin/openrouter/credits',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\OpenRouterController::credits
* @see app/Http/Controllers/SuperAdmin/OpenRouterController.php:11
* @route '/super-admin/openrouter/credits'
*/
credits.url = (options?: RouteQueryOptions) => {
    return credits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\OpenRouterController::credits
* @see app/Http/Controllers/SuperAdmin/OpenRouterController.php:11
* @route '/super-admin/openrouter/credits'
*/
credits.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: credits.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\OpenRouterController::credits
* @see app/Http/Controllers/SuperAdmin/OpenRouterController.php:11
* @route '/super-admin/openrouter/credits'
*/
credits.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: credits.url(options),
    method: 'head',
})

const openrouter = {
    credits: Object.assign(credits, credits),
}

export default openrouter