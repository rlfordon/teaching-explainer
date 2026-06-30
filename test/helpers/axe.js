import { AxeBuilder } from '@axe-core/playwright';

// Run axe against `selector`, restricted to WCAG 2.2 A/AA rules.
export async function runAxe(page, selector) {
  return new AxeBuilder({ page })
    .include(selector)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
}
