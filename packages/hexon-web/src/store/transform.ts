interface Slugable {
  slug: string;
}
export function encodeSlug<T extends Slugable>(item: T) {
  return { ...item, slug: encodeURIComponent(item.slug) };
}
export function decodeSlug<T extends Slugable>(item: T) {
  return { ...item, slug: decodeURIComponent(item.slug) };
}
