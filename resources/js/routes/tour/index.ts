import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TourController::status
* @see app/Http/Controllers/Api/TourController.php:12
* @route '/api/tour/status'
*/
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/tour/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TourController::status
* @see app/Http/Controllers/Api/TourController.php:12
* @route '/api/tour/status'
*/
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TourController::status
* @see app/Http/Controllers/Api/TourController.php:12
* @route '/api/tour/status'
*/
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TourController::status
* @see app/Http/Controllers/Api/TourController.php:12
* @route '/api/tour/status'
*/
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TourController::step
* @see app/Http/Controllers/Api/TourController.php:26
* @route '/api/tour/{tourName}/step'
*/
export const step = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: step.url(args, options),
    method: 'post',
})

step.definition = {
    methods: ["post"],
    url: '/api/tour/{tourName}/step',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TourController::step
* @see app/Http/Controllers/Api/TourController.php:26
* @route '/api/tour/{tourName}/step'
*/
step.url = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tourName: args }
    }

    if (Array.isArray(args)) {
        args = {
            tourName: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tourName: args.tourName,
    }

    return step.definition.url
            .replace('{tourName}', parsedArgs.tourName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TourController::step
* @see app/Http/Controllers/Api/TourController.php:26
* @route '/api/tour/{tourName}/step'
*/
step.post = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: step.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TourController::complete
* @see app/Http/Controllers/Api/TourController.php:46
* @route '/api/tour/{tourName}/complete'
*/
export const complete = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/api/tour/{tourName}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TourController::complete
* @see app/Http/Controllers/Api/TourController.php:46
* @route '/api/tour/{tourName}/complete'
*/
complete.url = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tourName: args }
    }

    if (Array.isArray(args)) {
        args = {
            tourName: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tourName: args.tourName,
    }

    return complete.definition.url
            .replace('{tourName}', parsedArgs.tourName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TourController::complete
* @see app/Http/Controllers/Api/TourController.php:46
* @route '/api/tour/{tourName}/complete'
*/
complete.post = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TourController::skip
* @see app/Http/Controllers/Api/TourController.php:56
* @route '/api/tour/{tourName}/skip'
*/
export const skip = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: skip.url(args, options),
    method: 'post',
})

skip.definition = {
    methods: ["post"],
    url: '/api/tour/{tourName}/skip',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TourController::skip
* @see app/Http/Controllers/Api/TourController.php:56
* @route '/api/tour/{tourName}/skip'
*/
skip.url = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tourName: args }
    }

    if (Array.isArray(args)) {
        args = {
            tourName: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tourName: args.tourName,
    }

    return skip.definition.url
            .replace('{tourName}', parsedArgs.tourName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TourController::skip
* @see app/Http/Controllers/Api/TourController.php:56
* @route '/api/tour/{tourName}/skip'
*/
skip.post = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: skip.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TourController::reset
* @see app/Http/Controllers/Api/TourController.php:66
* @route '/api/tour/{tourName}/reset'
*/
export const reset = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(args, options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/api/tour/{tourName}/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TourController::reset
* @see app/Http/Controllers/Api/TourController.php:66
* @route '/api/tour/{tourName}/reset'
*/
reset.url = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tourName: args }
    }

    if (Array.isArray(args)) {
        args = {
            tourName: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tourName: args.tourName,
    }

    return reset.definition.url
            .replace('{tourName}', parsedArgs.tourName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TourController::reset
* @see app/Http/Controllers/Api/TourController.php:66
* @route '/api/tour/{tourName}/reset'
*/
reset.post = (args: { tourName: string | number } | [tourName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(args, options),
    method: 'post',
})

const tour = {
    status: Object.assign(status, status),
    step: Object.assign(step, step),
    complete: Object.assign(complete, complete),
    skip: Object.assign(skip, skip),
    reset: Object.assign(reset, reset),
}

export default tour