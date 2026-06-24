import tenant from './tenant'
import model from './model'
import openrouter from './openrouter'

const admin = {
    tenant: Object.assign(tenant, tenant),
    model: Object.assign(model, model),
    openrouter: Object.assign(openrouter, openrouter),
}

export default admin