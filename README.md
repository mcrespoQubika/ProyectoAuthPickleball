# Proyecto

## CI – Browser configuration

The CI workflow runs tests on **Chromium only** by default.

To run on additional browsers, update the two install steps in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) and enable the corresponding projects in [`playwright.config.ts`](playwright.config.ts).

### Chromium only (default)

```yaml
- name: Install Playwright Browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps chromium

- name: Install system deps (cache hit)
  if: steps.playwright-cache.outputs.cache-hit == 'true'
  run: npx playwright install-deps chromium
```

### Chromium + Firefox

```yaml
- name: Install Playwright Browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps chromium firefox

- name: Install system deps (cache hit)
  if: steps.playwright-cache.outputs.cache-hit == 'true'
  run: npx playwright install-deps chromium firefox
```

### All browsers (Chromium + Firefox + WebKit)

```yaml
- name: Install Playwright Browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps

- name: Install system deps (cache hit)
  if: steps.playwright-cache.outputs.cache-hit == 'true'
  run: npx playwright install-deps
```
