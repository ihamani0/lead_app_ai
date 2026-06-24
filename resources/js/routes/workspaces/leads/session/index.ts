import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SessionController::status
* @see app/Http/Controllers/SessionController.php:66
* @route '/workspaces/{slug}/leads/{lead}/session/status'
*/
export const status = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

status.definition = {
    methods: ["post"],
    url: '/workspaces/{slug}/leads/{lead}/session/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SessionController::status
* @see app/Http/Controllers/SessionController.php:66
* @route '/workspaces/{slug}/leads/{lead}/session/status'
*/
status.url = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            slug: args[0],
            lead: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
        lead: typeof args.lead === 'object'
        ? args.lead.id
        : args.lead,
    }

    return status.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SessionController::status
* @see app/Http/Controllers/SessionController.php:66
* @route '/workspaces/{slug}/leads/{lead}/session/status'
*/
status.post = (args: { slug: string | number, lead: string | number | { id: string | number } } | [slug: string | number, lead: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

const session = {
    status: Object.assign(status, status),
}

export default session