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

// optionTextDetail narrows the match when several options share the same optionTextPrefix
// (e.g. two options both labeled "Single Elimination" but with a different description) — pass
// a snippet unique to the description of the one you want.
export async function selectOptionByPrefix(
  page,
  triggerLocator,
  optionsSelector,
  optionTextPrefix,
  optionTextDetail,
) {
  await openOverlayOptions(page, triggerLocator, optionsSelector);

  const escapedPrefix = optionTextPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let option = page.locator(optionsSelector, { hasText: new RegExp(`^${escapedPrefix}`) });
  if (optionTextDetail) {
    option = option.filter({ hasText: optionTextDetail });
  }

  const matchCount = await option.count();
  if (matchCount !== 1) {
    const detailInfo = optionTextDetail ? ` and detail "${optionTextDetail}"` : ' (no detail set)';
    throw new Error(
      `Bracket config error: expected exactly one "Bracket Format" option matching prefix "${optionTextPrefix}"${detailInfo}, but found ${matchCount}. ` +
        'Multiple options share this prefix — set bracketFormatDetail in bracketConfigs.js to a unique snippet of the option description you want.',
    );
  }

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
