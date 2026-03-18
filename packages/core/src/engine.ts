#!/usr/bin/env node
import fs from "fs";
import path from "path";
import type { Config, Stack, Step, Context, Provider } from "./types.js";

const providerCache = new Map<string, Provider>();
const configPath = process.argv[2];

if (!configPath) {
    console.error("❌ Usage: iac <path-to-config.json | path-to-stack.json>");
    process.exit(1);
}

const file = JSON.parse(fs.readFileSync(path.resolve(configPath), "utf-8"));
const isStack = "steps" in file;

if (isStack) {
    await runStack(file as Stack);
} else {
    await runStep({ id: "result", ...file as Config }, {});
}

async function runStack(stack: Stack) {
    console.log(`\n📦 Stack: ${stack.name} (${stack.steps.length} steps)\n`);
    const context: Context = {};
    for (const [i, step] of stack.steps.entries()) {
        console.log(`  [${i + 1}/${stack.steps.length}] ${step.id}`);
        context[step.id] = await runStep(step, context);
    }
    console.log(`\n✅ Stack complete.\n`);
    console.log(JSON.stringify(context, null, 2));
}

async function runStep(step: Step, context: Context) {
    const { id, provider, resource, action, params } = step;
    const resolvedParams = resolveRefs(params, context);

    const providerModule = await loadProvider(provider);

    const resourceModule = providerModule[resource];
    if (!resourceModule) {
        console.error(`❌ Resource "${resource}" not found in provider "${provider}".`);
        process.exit(1);
    }

    const actionFn = resourceModule[action];
    if (typeof actionFn !== "function") {
        console.error(`❌ Action "${action}" not found on "${resource}". Available: ${Object.keys(resourceModule).join(", ")}`);
        process.exit(1);
    }

    console.log(`     → ${provider}/${resource}:${action}`);
    const result = await actionFn(resolvedParams, context);
    console.log(`     ✅ ${id}:`, JSON.stringify(result));
    return result;
}

async function loadProvider(name: string): Promise<Provider> {
    const cached = providerCache.get(name);
    if (cached) return cached;
    let mod: Provider;
    try {
        mod = await import(`@openiac/provider-${name}`);
    } catch (err) {
        if (err instanceof Error && err.message.includes("Cannot find package")) {
            console.error(`❌ Provider "${name}" not found. Run: npm install @openiac/provider-${name}`);
        } else {
            console.error(`❌ Failed to load provider "${name}":`, err instanceof Error ? err.message : err);
        }
        process.exit(1);
    }
    providerCache.set(name, mod);
    return mod;
}

function resolveRefs(params: Record<string, unknown>, context: Context): Record<string, unknown> {
    return JSON.parse(
        JSON.stringify(params).replace(/"\$context\.([^"]+)"/g, (_, refPath) => {
            const value = refPath.split(".").reduce(
                (obj: unknown, key: string) => obj && typeof obj === "object"
                    ? (obj as Record<string, unknown>)[key]
                    : undefined,
                context
            );
            return value !== undefined ? JSON.stringify(value) : `"$context.${refPath}"`;
        })
    );
}