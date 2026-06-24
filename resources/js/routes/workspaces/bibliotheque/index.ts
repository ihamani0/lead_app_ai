import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\BibliothequeController::index
* @see app/Http/Controllers/BibliothequeController.php:19
* @route '/workspaces/{slug}/bibliotheque'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/bibliotheque',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BibliothequeController::index
* @see app/Http/Controllers/BibliothequeController.php:19
* @route '/workspaces/{slug}/bibliotheque'
*/
index.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BibliothequeController::index
* @see app/Http/Controllers/BibliothequeController.php:19
* @route '/workspaces/{slug}/bibliotheque'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BibliothequeController::index
* @see app/Http/Controllers/BibliothequeController.php:19
* @route '/workspaces/{slug}/bibliotheque'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

const bibliotheque = {
    index: Object.assign(index, index),
}

export default bibliotheque