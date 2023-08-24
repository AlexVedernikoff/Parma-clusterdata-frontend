export type AllowedTypes = Set<string>;
export type CheckAllowed<T> = (item: T) => boolean;
