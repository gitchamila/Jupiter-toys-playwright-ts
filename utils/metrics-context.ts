const metricsContext: Record<string, unknown> = {};

export function setMetric(key: string, value: unknown): void {
    console.debug(`setMetric(key='${key}', value='${value}')`);
    metricsContext[key] = value;
}

export function getMetric<T>(key: string): T | undefined {
    return metricsContext[key] as T | undefined;
}