import { expect, vi } from 'vitest';
import { DateTime } from '../src/js/datetime';
import { OptionsStore } from '../src/js/utilities/optionsStore';
import DefaultFormatLocalization from '../src/js/utilities/default-format-localization';
import {
  FixtureServiceLocator,
  MockLoad,
} from './fixtures/serviceLocator.fixture';
import { FixtureOptionsStore } from './fixtures/optionStore.fixture';
import { FixtureEventEmitters } from './fixtures/eventemitters.fixture';

const fixtureServiceLocator = new FixtureServiceLocator();
fixtureServiceLocator.loadEach({
  OptionsStore: FixtureOptionsStore,
  EventEmitters: FixtureEventEmitters,
});

vi.mock('../src/js/utilities/service-locator', () => ({
  serviceLocator: fixtureServiceLocator,
}));

/** March 14th, 2023 */
const newDate = () => new DateTime(2023, 3 - 1, 14);
const vanillaDate = () => new Date(2023, 3 - 1, 14);

/** July 8th, 2023 */
const secondaryDate = () => new DateTime(2023, 7 - 1, 8);

const newDateStringDate = newDate().format('L');
const newDateStringIso = newDate().toISOString();

let store = fixtureServiceLocator.locate(OptionsStore);

const reset = () => {
  (store as unknown as FixtureOptionsStore).reset();
  store.viewDate = newDate();
};

/** Calendar selections use local midnight (no time-of-day). */
function expectDateTimeMidnightLocal(d: DateTime) {
  expect(d.getHours()).toBe(0);
  expect(d.getMinutes()).toBe(0);
  expect(d.getSeconds()).toBe(0);
  expect(d.getMilliseconds()).toBe(0);
}

const loadFixtures = (load: MockLoad) => {
  fixtureServiceLocator.loadEach(load);
};

const defaultLocalization = () => ({ ...DefaultFormatLocalization });

const createElementWithClasses = (tagName: string, ...classes) => {
  const tag = document.createElement(tagName);
  tag.classList.add(...classes);
  return tag;
};

reset();

export {
  newDate,
  newDateStringDate,
  newDateStringIso,
  vanillaDate,
  secondaryDate,
  reset,
  store,
  defaultLocalization,
  loadFixtures,
  createElementWithClasses,
  expectDateTimeMidnightLocal,
};
