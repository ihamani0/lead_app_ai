import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\CheckoutController::checkout
* @see app/Http/Controllers/Settings/CheckoutController.php:98
* @route '/billing/credit/checkout/{creditPackage}'
*/
export const checkout = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(args, options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/billing/credit/checkout/{creditPackage}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\CheckoutController::checkout
* @see app/Http/Controllers/Settings/CheckoutController.php:98
* @route '/billing/credit/checkout/{creditPackage}'
*/
checkout.url = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkout.definition.url
            .replace('{creditPackage}', parsedArgs.creditPackage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\CheckoutController::checkout
* @see app/Http/Controllers/Settings/CheckoutController.php:98
* @route '/billing/credit/checkout/{creditPackage}'
*/
checkout.post = (args: { creditPackage: number | { id: number } } | [creditPackage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(args, options),
    method: 'post',
})

const credit = {
    checkout: Object.assign(checkout, checkout),
}

export default credit