export function classNameToSelector(className: string | null): string | null {
  if (!className?.trim()) return null;
  return `.${className.trim().replace(/\s+/g, '.')}`;
}
