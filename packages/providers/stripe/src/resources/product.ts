import type { Resource } from "@openiac/core";
import { stripe } from "../client.js";

function formatProduct(result: {
    id: string;
    name: string;
    description?: string | null;
    active: boolean;
    default_price?: string | { id: string } | null;
    metadata?: Record<string, string>;
}) {
    return {
        id: result.id,
        name: result.name,
        description: result.description,
        active: result.active,
        default_price:
            typeof result.default_price === "object" && result.default_price
                ? result.default_price.id
                : result.default_price,
        metadata: result.metadata,
    };
}

export const product: Resource = {
    async create(params: Record<string, unknown>) {
        const result = await stripe.products.create(
            params as unknown as Parameters<typeof stripe.products.create>[0]
        );
        return formatProduct(result);
    },

    async list(params: Record<string, unknown> = {}) {
        const result = await stripe.products.list(
            params as unknown as Parameters<typeof stripe.products.list>[0]
        );
        return result.data.map((p) => ({
            id: p.id,
            name: p.name,
            active: p.active,
        }));
    },

    async retrieve(params: Record<string, unknown>) {
        const result = await stripe.products.retrieve(params.id as string);
        return formatProduct(result);
    },

    async delete(params: Record<string, unknown>) {
        const result = await stripe.products.del(params.id as string);
        return { id: result.id, deleted: result.deleted };
    },
};
