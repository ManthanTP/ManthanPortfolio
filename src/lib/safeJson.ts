export function safeJsonParse<T>(value: string | undefined | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (err) {
    console.warn('Failed to parse JSON string:', value, err);
    return fallback;
  }
}
