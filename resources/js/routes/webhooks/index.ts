import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EvolutionWebhookController::evolution
* @see app/Http/Controllers/Api/EvolutionWebhookController.php:16
* @route '/webhooks/evolution'
*/
export const evolution = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: evolution.url(options),
    method: 'post',
})

evolution.definition = {
    methods: ["post"],
    url: '/webhooks/evolution',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EvolutionWebhookController::evolution
* @see app/Http/Controllers/Api/EvolutionWebhookController.php:16
* @route '/webhooks/evolution'
*/
evolution.url = (options?: RouteQueryOptions) => {
    return evolution.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EvolutionWebhookController::evolution
* @see app/Http/Controllers/Api/EvolutionWebhookController.php:16
* @route '/webhooks/evolution'
*/
evolution.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: evolution.url(options),
    method: 'post',
})

const webhooks = {
    evolution: Object.assign(evolution, evolution),
}

export default webhooks