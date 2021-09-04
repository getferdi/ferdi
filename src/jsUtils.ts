export const ifUndefinedString = (source: string | undefined, defaultValue: string): string => (source !== undefined ? source : defaultValue);
export const ifUndefinedBoolean = (source: boolean | undefined, defaultValue: boolean): boolean => Boolean(source !== undefined ? source : defaultValue);
export const ifUndefinedNumber = (source: number | undefined, defaultValue: number): number => Number(source !== undefined ? source : defaultValue) || 0;
