export const ifUndefinedString = (source: string | undefined, defaultValue: string): string => (source !== undefined ? source : defaultValue);
export const ifUndefinedBoolean = (source: boolean | undefined, defaultValue: boolean): boolean => (source !== undefined ? source : defaultValue);
export const ifUndefinedNumber = (source: number | undefined, defaultValue: number): number => (source !== undefined ? source : defaultValue);
