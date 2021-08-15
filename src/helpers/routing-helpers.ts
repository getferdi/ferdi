import RouteParser from 'route-parser';

export const matchRoute = (pattern: string, path: string) => new RouteParser(pattern).match(path);
