'use strict';

export const VAADIN_SELECT_OPTIONS = 'vaadin-select-overlay[opened] vaadin-select-item';
export const VAADIN_TIME_PICKER_OPTIONS = 'vaadin-time-picker-overlay vaadin-time-picker-item';

async function openOverlayOptions(page, triggerLocator, optionsSelector) {
  await triggerLocator.click();
  const options = page.locator(optionsSelector);
  await options.first().waitFor({ state: 'visible' });
  return options;
}

export async function selectExactOption(page, triggerLocator, optionsSelector, optionText) {
  await openOverlayOptions(page, triggerLocator, optionsSelector);

  const option = page.locator(`${optionsSelector}:text-is("${optionText}")`);
  await option.waitFor({ state: 'visible' });
  await option.click();
}

export async function selectOptionByPrefix(page, triggerLocator, optionsSelector, optionTextPrefix) {
  await openOverlayOptions(page, triggerLocator, optionsSelector);

  const escapedPrefix = optionTextPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const option = page.locator(optionsSelector, { hasText: new RegExp(`^${escapedPrefix}`) });
  await option.waitFor({ state: 'visible' });
  await option.click();
}

export async function selectRandomOption(page, triggerLocator, optionsSelector) {
  const options = await openOverlayOptions(page, triggerLocator, optionsSelector);

  const optionsCount = await options.count();
  const randomIndex = Math.floor(Math.random() * optionsCount);
  const chosenOption = options.nth(randomIndex);
  const chosenText = (await chosenOption.textContent()).trim();
  await chosenOption.click();
  return chosenText;
}
