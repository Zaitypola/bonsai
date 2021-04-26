export type InputModel<T> = Omit<T, '_id' | '_v' | 'createdAt' | 'updatedAt'> & Partial<T>;
