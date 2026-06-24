import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:16
* @route '/super-admin/tenants'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/tenants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:16
* @route '/super-admin/tenants'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:16
* @route '/super-admin/tenants'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::index
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:16
* @route '/super-admin/tenants'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::show
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:30
* @route '/super-admin/tenants/{tenant}'
*/
export const show = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/super-admin/tenants/{tenant}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::show
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:30
* @route '/super-admin/tenants/{tenant}'
*/
show.url = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tenant: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tenant: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tenant: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tenant: typeof args.tenant === 'object'
        ? args.tenant.id
        : args.tenant,
    }

    return show.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::show
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:30
* @route '/super-admin/tenants/{tenant}'
*/
show.get = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::show
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:30
* @route '/super-admin/tenants/{tenant}'
*/
show.head = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::addDollars
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:54
* @route '/super-admin/tenants/{tenant}/add-dollars'
*/
export const addDollars = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addDollars.url(args, options),
    method: 'post',
})

addDollars.definition = {
    methods: ["post"],
    url: '/super-admin/tenants/{tenant}/add-dollars',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::addDollars
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:54
* @route '/super-admin/tenants/{tenant}/add-dollars'
*/
addDollars.url = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tenant: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tenant: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tenant: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tenant: typeof args.tenant === 'object'
        ? args.tenant.id
        : args.tenant,
    }

    return addDollars.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::addDollars
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:54
* @route '/super-admin/tenants/{tenant}/add-dollars'
*/
addDollars.post = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addDollars.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::updateModel
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:72
* @route '/super-admin/tenants/{tenant}/update-model'
*/
export const updateModel = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateModel.url(args, options),
    method: 'post',
})

updateModel.definition = {
    methods: ["post"],
    url: '/super-admin/tenants/{tenant}/update-model',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::updateModel
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:72
* @route '/super-admin/tenants/{tenant}/update-model'
*/
updateModel.url = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tenant: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tenant: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tenant: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tenant: typeof args.tenant === 'object'
        ? args.tenant.id
        : args.tenant,
    }

    return updateModel.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\SuperAdminTenantController::updateModel
* @see app/Http/Controllers/SuperAdmin/SuperAdminTenantController.php:72
* @route '/super-admin/tenants/{tenant}/update-model'
*/
updateModel.post = (args: { tenant: string | number | { id: string | number } } | [tenant: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateModel.url(args, options),
    method: 'post',
})

const tenant = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    addDollars: Object.assign(addDollars, addDollars),
    updateModel: Object.assign(updateModel, updateModel),
}

export default tenant