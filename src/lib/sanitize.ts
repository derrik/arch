import DOMPurify from 'dompurify';

export function sanitizeSvg(raw: string): string {
  return DOMPurify.sanitize(raw, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
  });
}
