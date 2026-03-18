export type ActionFn<TParams = Record<string, unknown>, TResult = unknown> = (
    params: TParams,
    context: Context
) => Promise<TResult>;

export interface Resource {
    [action: string]: ActionFn;
}

export interface Provider {
    [resource: string]: Resource;
}

export interface Config {
    provider: string;
    resource: string;
    action: string;
    params: Record<string, unknown>;
}

export interface Step extends Config {
    id: string;
}

export interface Stack {
    name: string;
    steps: Step[];
}

export type Context = Record<string, unknown>;