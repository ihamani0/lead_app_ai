# N8N Token Tracking Integration Guide

## Overview
This document explains how to integrate N8N workflows with the token tracking system. The system tracks LLM (Gemini) token usage and deducts tokens from tenant balances.

---

## Step 1: Get API Token for Tenant

As Super-Admin, you can create a Sanctum token for any tenant:

```bash
# Via artisan tinker
php artisan tinker --execute="\$tenant = App\Models\Tenant::where('slug', 'tenant-slug')->first(); echo \$tenant->createToken('n8n-token')->plainTextToken;"
```

Or use the built-in endpoint (for testing):
```
GET /create-n8n-token
```
This creates a test tenant and returns a token.

---

## Step 2: Pre-Workflow Token Check (Recommended)

Before executing an AI workflow, check if the tenant has sufficient tokens:

### Request
```bash
GET /api/n8n/token-status?tenant_slug={tenant-slug}
Headers:
  Authorization: Bearer {sanctum_token}
  Accept: application/json
```

### Response (Sufficient Tokens)
```json
{
  "has_sufficient_tokens": true,
  "balance": 5000,
  "is_low_balance": false,
  "threshold": 1200
}
```

### Response (Low Balance)
```json
{
  "has_sufficient_tokens": false,
  "balance": 800,
  "is_low_balance": true,
  "threshold": 1200
}
```

**N8N Workflow Logic**: If `has_sufficient_tokens` is `false`, stop the workflow and notify the tenant.

---

## Step 3: Post-Workflow Token Reporting

After the Gemini/LLM call completes and you have the token counts, report usage:

### Request
```bash
POST /api/n8n/token-usage
Headers:
  Authorization: Bearer {sanctum_token}
  Content-Type: application/json
  Accept: application/json

Body:
{
  "tenant_slug": "tenant-slug",
  "total_tokens": 1500,
  "input_tokens": 500,
  "output_tokens": 1000,
  "reference_type": "n8n_workflow",
  "reference_id": "workflow_123"
}
```

### Field Description
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tenant_slug` | string | Yes | The tenant's slug identifier |
| `total_tokens` | integer | Yes | Total tokens used (input + output) |
| `input_tokens` | integer | No | LLM input/prompt tokens |
| `output_tokens` | integer | No | LLM output/completion tokens |
| `reference_type` | string | No | Type of usage (default: n8n_workflow) |
| `reference_id` | string | No | Workflow ID or reference |

### Success Response
```json
{
  "status": "success"
}
```

### Error Response (Insufficient Tokens)
```json
{
  "error": "Insufficient tokens"
}
```
HTTP Status: 402 Payment Required

---

## Step 4: Gemini Token Counting

Gemini API returns token counts in the response. Example:

```javascript
// N8N HTTP Request to Gemini
const response = await axios.post(GEMINI_URL, {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { ... }
});

// Extract token counts
const inputTokens = response.data.usageMetadata?.promptTokenCount || 0;
const outputTokens = response.data.usageMetadata?.candidatesTokenCount || 0;
const totalTokens = inputTokens + outputTokens;

// Report to our API
await axios.post(`${BASE_URL}/api/n8n/token-usage`, {
  tenant_slug: tenantSlug,
  total_tokens: totalTokens,
  input_tokens: inputTokens,
  output_tokens: outputTokens,
  reference_type: 'gemini_workflow',
  reference_id: workflowId
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## Step 5: Testing with cURL

### 1. Get a Token (via tinker)
```bash
php artisan tinker --execute="\$t = App\Models\Tenant::first(); echo \$t->createToken('test')->plainTextToken;"
```

### 2. Test Token Status Endpoint
```bash
curl -H "Authorization: Bearer {YOUR_TOKEN}" \
     "http://localhost:8000/api/n8n/token-status?tenant_slug={slug}"
```

### 3. Test Token Usage Endpoint
```bash
curl -X POST \
     -H "Authorization: Bearer {YOUR_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{"tenant_slug":"{slug}","total_tokens":500,"input_tokens":200,"output_tokens":300}' \
     "http://localhost:8000/api/n8n/token-usage"
```

### 4. Verify Database
```bash
# Check token_transactions table
php artisan tinker --execute="echo App\Models\TokenTransaction::latest()->first()->toJson();"

# Check tenant balance
php artisan tinker --execute="echo App\Models\Tenant::where('slug','{slug}')->first()->token_balance;"
```

---

## N8N Workflow Example

1. **Node 1: HTTP Request (Token Status Check)**
   - Method: GET
   - URL: `{{$env.BASE_URL}}/api/n8n/token-status?tenant_slug={{$json.tenant_slug}}`
   - Headers: `Authorization: Bearer {{$env.API_TOKEN}}`

2. **Node 2: IF Node**
   - Condition: `{{$json.has_sufficient_tokens}} == true`
   - True: Continue to LLM call
   - False: Send notification, stop workflow

3. **Node 3: Gemini LLM Call**
   - Make the API call to Gemini
   - Extract `usageMetadata.promptTokenCount` and `usageMetadata.candidatesTokenCount`

4. **Node 4: HTTP Request (Report Usage)**
   - Method: POST
   - URL: `{{$env.BASE_URL}}/api/n8n/token-usage`
   - Body:
     ```json
     {
       "tenant_slug": "{{$node[1].json.tenant_slug}}",
       "total_tokens": {{$node[3].json.usageMetadata.promptTokenCount + $node[3].json.usageMetadata.candidatesTokenCount}},
       "input_tokens": {{$node[3].json.usageMetadata.promptTokenCount}},
       "output_tokens": {{$node[3].json.usageMetadata.candidatesTokenCount}}
     }
     ```

---

## Tenant Dashboard

Tenants can view their token usage at:
- **Dashboard**: `/dashboard` - Shows balance, low-balance warning, usage chart
- **Detailed Usage**: (Coming soon) `/tokens` - Full transaction history

Super-Admins can manage tenant tokens at:
- **Tenants List**: `/super-admin/tenants`
- **Tenant Detail**: `/super-admin/tenants/{slug}` - Recharge form, daily usage chart, transaction history
