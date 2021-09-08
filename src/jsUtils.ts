export const ifUndefinedString = (source: string | undefined | null, defaultValue: string): string => (source !== undefined && source !== null ? source : defaultValue);
export const ifUndefinedBoolean = (source: boolean | undefined | null, defaultValue: boolean): boolean => Boolean(source !== undefined && source !== null ? source : defaultValue);
export const ifUndefinedNumber = (source: number | undefined | null, defaultValue: number): number => Number(source !== undefined && source !== null ? source : defaultValue);
