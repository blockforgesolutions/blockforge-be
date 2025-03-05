/**
 * Transforms MongoDB document by converting _id to id and removing __v
 * @param document The MongoDB document to transform
 * @returns Transformed document with id instead of _id and without __v, or null if document is null
 */
export function transformMongoDocument<T extends { _id: any; __v?: any }>(
  document: T | null
): (Omit<T, '_id' | '__v'> & { id: any }) | null {
  if (!document) {
    return null;
  }
  const { _id, __v, ...rest } = document;
  return {
    id: _id,
    ...rest,
  };
}

/**
 * Transforms an array of MongoDB documents by converting _id to id and removing __v
 * @param documents Array of MongoDB documents to transform
 * @returns Array of transformed documents with id instead of _id and without __v
 */
export function transformMongoArray<T extends { _id: any; __v?: any }>(
  documents: T[]
): (Omit<T, '_id' | '__v'> & { id: any })[] {
  return documents.map(transformMongoDocument).filter((doc): doc is Omit<T, '_id' | '__v'> & { id: any } => doc !== null);
} 