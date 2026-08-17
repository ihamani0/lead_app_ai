import creditPackages from './credit-packages'
import leads from './leads'
import model from './model'
import openrouter from './openrouter'
import plan from './plan'
import reports from './reports'
import tenant from './tenant'
import tokenUsage from './token-usage'

const admin = {
    tenant: Object.assign(tenant, tenant),
    reports: Object.assign(reports, reports),
    leads: Object.assign(leads, leads),
    model: Object.assign(model, model),
    plan: Object.assign(plan, plan),
    creditPackages: Object.assign(creditPackages, creditPackages),
    tokenUsage: Object.assign(tokenUsage, tokenUsage),
    openrouter: Object.assign(openrouter, openrouter),
}

export default admin