import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Team\TeamMemberController::index
* @see app/Http/Controllers/Team/TeamMemberController.php:17
* @route '/workspaces/{slug}/members'
*/
export const index = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces/{slug}/members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Team\TeamMemberController::index
* @see app/Http/Controllers/Team/TeamMemberController.php:17
* @route '/workspaces/{slug}/members'
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
* @see \App\Http\Controllers\Team\TeamMemberController::index
* @see app/Http/Controllers/Team/TeamMemberController.php:17
* @route '/workspaces/{slug}/members'
*/
index.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Team\TeamMemberController::index
* @see app/Http/Controllers/Team/TeamMemberController.php:17
* @route '/workspaces/{slug}/members'
*/
index.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

const members = {
    index: Object.assign(index, index),
}

export default members