import type { Resource } from "@openiac/core";
import { stripe } from "../client.js";

function formatPrice(result: {
    id: string;
    product: string | { id: string };
    active: boolean;
    currency: string;
    unit_amount?: number | null;
    type: string;
    recurring?: { interval: string; interval_count: number } | null;
    metadata?: Record<string, string>;
}) {
    return {
        id: result.id,
        product:
            typeof result.product === "object"
                ? result.product.id
                : result.product,
        active: result.active,
        currency: result.currency,
        unit_amount: result.unit_amount,
        type: result.type,
        recurring: result.recurring,
        metadata: result.metadata,
    };
}

export const price: Resource = {
    async create(params: Record<string, unknown>) {
        const result = await stripe.prices.create(
            params as Parameters<typeof stripe.prices.create>[0]
        );
        return formatPrice(result);
    },

    async list(params: Record<string, unknown> = {}) {
        const result = await stripe.prices.list(
            params as Parameters<typeof stripe.prices.list>[0]
        );
        return result.data.map((p) => ({
            id: p.id,
            product: typeof p.product === "object" ? p.product.id : p.product,
            active: p.active,
            unit_amount: p.unit_amount,
            type: p.type,
        }));
    },

    async retrieve(params: { id: string }) {
        const result = await stripe.prices.retrieve(params.id);
        return formatPrice(result);
    },

    async update(params: { id: string; [key: string]: unknown }) {
        const { id, ...rest } = params;
        const result = await stripe.prices.update(
            id,
            rest as Parameters<typeof stripe.prices.update>[1]
        );
        return formatPrice(result);
    },
};
