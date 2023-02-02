export function cleanData<T extends {}, U>(data: T[], keysToRemove: string[]) {
  return data.map(obj => {
    const filteredEntries = Object.entries<U>(obj).filter(
      ([key]) => !keysToRemove.includes(key)
    );
    return Object.fromEntries(filteredEntries);
  });
}
