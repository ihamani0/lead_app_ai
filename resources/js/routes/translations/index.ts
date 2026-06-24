import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TranslationController::show
* @see app/Http/Controllers/TranslationController.php:14
* @route '/translations/{locale}'
*/
export const show = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/translations/{locale}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TranslationController::show
* @see app/Http/Controllers/TranslationController.php:14
* @route '/translations/{locale}'
*/
show.url = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { locale: args }
    }

    if (Array.isArray(args)) {
        args = {
            locale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        locale: args.locale,
    }

    return show.definition.url
            .replace('{locale}', parsedArgs.locale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TranslationController::show
* @see app/Http/Controllers/TranslationController.php:14
* @route '/translations/{locale}'
*/
show.get = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TranslationController::show
* @see app/Http/Controllers/TranslationController.php:14
* @route '/translations/{locale}'
*/
show.head = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TranslationController::refresh
* @see app/Http/Controllers/TranslationController.php:70
* @route '/lang/refresh'
*/
export const refresh = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refresh.url(options),
    method: 'post',
})

refresh.definition = {
    methods: ["post"],
    url: '/lang/refresh',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TranslationController::refresh
* @see app/Http/Controllers/TranslationController.php:70
* @route '/lang/refresh'
*/
refresh.url = (options?: RouteQueryOptions) => {
    return refresh.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TranslationController::refresh
* @see app/Http/Controllers/TranslationController.php:70
* @route '/lang/refresh'
*/
refresh.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refresh.url(options),
    method: 'post',
})

const translations = {
    show: Object.assign(show, show),
    refresh: Object.assign(refresh, refresh),
}

export default translations