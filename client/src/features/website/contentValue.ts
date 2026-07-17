export const contentText = (metadata: Record<string, unknown>, key: string): string => {
  const value = metadata[key];
  return typeof value === 'string' ? value : '';
};

export const contentNumber = (
  metadata: Record<string, unknown>,
  key: string,
  defaultValue = 0,
): number => {
  const value = metadata[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : defaultValue;
};

export const contentStrings = (metadata: Record<string, unknown>, key: string): string[] => {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
};

export const contentObjects = <T extends object>(
  metadata: Record<string, unknown>,
  key: string,
): T[] => {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter((entry): entry is T => Boolean(entry) && typeof entry === 'object')
    : [];
};
