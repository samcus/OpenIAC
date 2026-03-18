# @openiac/provider-stripe

Stripe provider for [OpenIAC](../../README.md). Manages Stripe resources (products, prices) via JSON configs.

---

## Setup

### 1. Get Your Stripe API Key

1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API keys**
3. Copy your **Secret key** (`sk_test_...` for test mode, `sk_live_...` for production)

> Use test mode keys during development. Test mode resources are isolated and won't affect real data.

### 2. Set the Environment Variable

The provider reads `STRIPE_SECRET_KEY` from the environment. It must be set before running any config.

```bash
# Option 1: export in your shell
export STRIPE_SECRET_KEY=sk_test_...

# Option 2: inline for a single run
STRIPE_SECRET_KEY=sk_test_... pnpm iac path/to/config.json

# Option 3: use a .env file with dotenv-cli
npx dotenv -e .env -- pnpm iac path/to/config.json
```

> Never commit your secret key to version control. Add `.env` to your `.gitignore`.

---

## Available Resources

| Resource | Actions | Description |
|---|---|---|
| `product` | `create`, `list`, `retrieve`, `delete` | Stripe Products |
| `price` | `create`, `list`, `retrieve`, `update` | Stripe Prices (one-time or recurring) |

---

## Templates

Copy a template into your project and fill in the placeholder values.

| Template | Description |
|---|---|
| `product.create.json` | Create a standalone product |
| `price.one-time.create.json` | Create a one-time price for an existing product |
| `price.recurring.create.json` | Create a recurring price for an existing product |
| `product.one-time.stack.json` | Stack: create a product + one-time price |
| `product.subscription.stack.json` | Stack: create a product + recurring price |

---

## Quick Start

```bash
# Set your key
export STRIPE_SECRET_KEY=sk_test_...

# Run a stack to create a product with a price
pnpm iac packages/providers/stripe/iac_tests/product.one-time.stack.json
```
