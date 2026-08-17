import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::index
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:12
* @route '/super-admin/credit-packages'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/super-admin/credit-packages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::index
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:12
* @route '/super-admin/credit-packages'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::index
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:12
* @route '/super-admin/credit-packages'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::index
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:12
* @route '/super-admin/credit-packages'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::store
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:21
* @route '/super-admin/credit-packages'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/super-admin/credit-packages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::store
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:21
* @route '/super-admin/credit-packages'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::store
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:21
* @route '/super-admin/credit-packages'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::update
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:37
* @route '/super-admin/credit-packages/{creditPackage}'
*/
export const update = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/super-admin/credit-packages/{creditPackage}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::update
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:37
* @route '/super-admin/credit-packages/{creditPackage}'
*/
update.url = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { creditPackage: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { creditPackage: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            creditPackage: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        creditPackage: typeof args.creditPackage === 'object'
        ? args.creditPackage.id
        : args.creditPackage,
    }

    return update.definition.url
            .replace('{creditPackage}', parsedArgs.creditPackage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::update
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:37
* @route '/super-admin/credit-packages/{creditPackage}'
*/
update.post = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::destroy
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:53
* @route '/super-admin/credit-packages/{creditPackage}'
*/
export const destroy = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/super-admin/credit-packages/{creditPackage}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::destroy
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:53
* @route '/super-admin/credit-packages/{creditPackage}'
*/
destroy.url = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { creditPackage: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { creditPackage: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            creditPackage: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        creditPackage: typeof args.creditPackage === 'object'
        ? args.creditPackage.id
        : args.creditPackage,
    }

    return destroy.definition.url
            .replace('{creditPackage}', parsedArgs.creditPackage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdmin\CreditPackageController::destroy
* @see app/Http/Controllers/SuperAdmin/CreditPackageController.php:53
* @route '/super-admin/credit-packages/{creditPackage}'
*/
destroy.delete = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const creditPackages = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default creditPackages