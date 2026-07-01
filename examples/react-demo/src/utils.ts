export const textToBytes = (value: string): number[] => Array.from(new TextEncoder().encode(value))
