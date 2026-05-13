import {
  expectDateTimeMidnightLocal,
  loadFixtures,
  newDate,
  reset,
  store,
} from './test-utilities';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import Actions from '../src/js/actions';
import { FixtureValidation } from './fixtures/validation.fixture';
import { FixtureDates } from './fixtures/dates.fixture';
import { FixtureDisplay } from './fixtures/display.fixture';
import Namespace from '../src/js/utilities/namespace';
import ActionTypes from '../src/js/utilities/action-types';
import { Unit } from '../src/js/datetime';
import { EventEmitters } from '../src/js/utilities/event-emitter';
import Display from '../src/js/display';
import Dates from '../src/js/dates';
import Collapse from '../src/js/display/collapse';
import Validation from '../src/js/validation';
import { serviceLocator } from '../src/js/utilities/service-locator';

let validation: Validation;
let emitters: EventEmitters;
let display: Display;
let dates: Dates;

let actions: Actions;
let event;
let element: HTMLElement;

let isValidSpy;
vi.spyOn(Collapse, 'hideImmediately').mockImplementation(vi.fn());
vi.spyOn(Collapse, 'showImmediately').mockImplementation(vi.fn());
vi.spyOn(Collapse, 'toggle').mockImplementation(vi.fn());

beforeAll(() => {
  loadFixtures({
    Validation: FixtureValidation,
    Dates: FixtureDates,
    Display: FixtureDisplay,
  });
  reset();
  const ee = serviceLocator.locate(EventEmitters);
  let callback;
  ee.action.subscribe = (cb) => {
    callback = cb;
  };
  ee.action.emit = (value) => {
    callback(value);
  };
});

beforeEach(() => {
  reset();
  element = document.createElement('div');
  event = { currentTarget: element };
  actions = new Actions();
  store.viewDate = newDate();
  // @ts-ignore
  validation = actions.validation;
  // @ts-ignore
  emitters = actions._eventEmitters;
  // @ts-ignore
  display = actions.display;
  // @ts-ignore
  dates = actions.dates;
  dates.clear();

  isValidSpy = vi.spyOn(validation, 'isValid');
  isValidSpy.mockImplementation(() => true);

  // @ts-ignore
  display._widget = document.createElement('div');
});

afterAll(() => {
  vi.restoreAllMocks();
});

test('disabled', () => {
  element.classList.add(Namespace.css.disabled);
  actions.do(event);
  //what else could be done here?
});

test('next or previous', () => {
  const viewUpdateSpy = vi.spyOn(emitters.viewUpdate, 'emit');
  const showModeSpy = vi.spyOn(display, '_showMode');

  expect(store.viewDate).toEqual(newDate());

  //test from dataset
  element.dataset.action = 'next';
  actions.do(event);
  expect(store.viewDate).toEqual(newDate().manipulate(1, Unit.month));
  expect(viewUpdateSpy).toHaveBeenCalled();
  expect(showModeSpy).toHaveBeenCalled();

  store.viewDate = newDate();
  actions.do(event, ActionTypes.previous);
  expect(store.viewDate).toEqual(newDate().manipulate(-1, Unit.month));
  expect(viewUpdateSpy).toHaveBeenCalled();
  expect(showModeSpy).toHaveBeenCalled();
});

test('changeCalendarView', () => {
  const updateCalendarHeaderSpy = vi.spyOn(display, '_updateCalendarHeader');
  const showModeSpy = vi.spyOn(display, '_showMode');

  actions.do(event, ActionTypes.changeCalendarView);
  expect(updateCalendarHeaderSpy).toHaveBeenCalled();
  expect(showModeSpy).toHaveBeenCalled();
});

test('handleSelectCalendarMode', () => {
  const showModeSpy = vi.spyOn(display, '_showMode');
  const hideSpy = vi.spyOn(display, 'hide');
  const setValueSpy = vi.spyOn(dates, 'setValue');

  //test selecting month
  element.dataset.value = '1';
  actions.do(event, ActionTypes.selectMonth);
  expect(store.viewDate.month).toBe(1);
  expect(hideSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  const pickedArg = setValueSpy.mock.calls.at(-1)?.[0];
  expect(pickedArg).toBeDefined();
  expectDateTimeMidnightLocal(pickedArg);

  //test selecting year
  store.currentCalendarViewMode = 1;
  element.dataset.value = '2022';
  actions.do(event, ActionTypes.selectYear);
  expect(store.viewDate.year).toBe(2022);
  expect(showModeSpy).toHaveBeenCalled();
});

test('selectDay', () => {
  const hideSpy = vi.spyOn(display, 'hide');
  const setValueSpy = vi.spyOn(dates, 'setValue');

  let shouldBe = newDate();
  shouldBe.date = 21;
  shouldBe.startOf(Unit.date);

  element.dataset.day = `${shouldBe.date}`;

  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(hideSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expectDateTimeMidnightLocal(dates.picked[0]);

  //test previous month
  element.classList.add(Namespace.css.old);
  actions.do(event, ActionTypes.selectDay);
  shouldBe.manipulate(-1, Unit.month);
  expect(dates.picked).toEqual([shouldBe]);
  expectDateTimeMidnightLocal(dates.picked[0]);
  expect(hideSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  element.classList.remove(Namespace.css.old);
  shouldBe.manipulate(1, Unit.month);

  //test next month
  element.classList.add(Namespace.css.new);
  actions.do(event, ActionTypes.selectDay);
  shouldBe.manipulate(1, Unit.month);
  expect(dates.picked).toEqual([shouldBe]);
  expectDateTimeMidnightLocal(dates.picked[0]);
  expect(hideSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  element.classList.remove(Namespace.css.new);
});

test('selectDay - range', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  const clearSpy = vi.spyOn(dates, 'clear');
  const one = newDate().manipulate(1, Unit.date).startOf(Unit.date);
  const two = newDate().manipulate(2, Unit.date).startOf(Unit.date);

  let shouldBe = newDate();
  shouldBe.date = 21;
  shouldBe.startOf(Unit.date);

  element.dataset.day = `${shouldBe.date}`;
  store.options.dateRange = true;

  //test zero length selection
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expectDateTimeMidnightLocal(dates.picked[0]);
  expect(hideSpy).not.toHaveBeenCalled();

  dates.clear();

  //test already have two selected
  dates.setValue(one, 0);
  dates.setValue(two, 1);
  expect(dates.picked).toEqual([one, two]);
  actions.do(event, ActionTypes.selectDay);
  expect(clearSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expectDateTimeMidnightLocal(dates.picked[0]);

  dates.clear();

  //test one selected
  dates.setValue(one, 0);
  expect(dates.picked).toEqual([one]);
  actions.do(event, ActionTypes.selectDay);
  expect(dates.picked).toEqual([one, shouldBe]);
  dates.picked.forEach(expectDateTimeMidnightLocal);
  expect(setValueSpy).toHaveBeenCalled();

  dates.clear();

  //test one selected and new date is the same
  element.dataset.date = `${shouldBe.date}`;
  dates.setValue(shouldBe, 0);
  expect(dates.picked).toEqual([shouldBe]);
  actions.do(event, ActionTypes.selectDay);
  expect(clearSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();

  element.dataset.date = `${shouldBe.date}`;

  dates.clear();

  //test new selected date is before currently selected
  const before = shouldBe.clone.manipulate(14, Unit.date);
  dates.add(before);
  expect(dates.picked).toEqual([before]);
  actions.do(event, ActionTypes.selectDay);
  expect(dates.picked).toEqual([shouldBe, before]);
  dates.picked.forEach(expectDateTimeMidnightLocal);
});

test('select day - multiple dates', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const hideSpy = vi.spyOn(display, 'hide');
  const pickedIndexSpy = vi.spyOn(dates, 'pickedIndex');
  const one = newDate().manipulate(1, Unit.date).startOf(Unit.date);

  let shouldBe = newDate();
  shouldBe.date = 21;
  shouldBe.startOf(Unit.date);

  element.dataset.day = `${shouldBe.date}`;
  store.options.multipleDates = true;

  //test zero length selection
  pickedIndexSpy.mockImplementationOnce(() => -1);
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expectDateTimeMidnightLocal(dates.picked[0]);
  expect(hideSpy).not.toHaveBeenCalled();

  //test additional date
  element.dataset.day = `${one.date}`;
  pickedIndexSpy.mockImplementationOnce(() => -1);
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe, one]);
  dates.picked.forEach(expectDateTimeMidnightLocal);
  expect(hideSpy).not.toHaveBeenCalled();

  //test removing selected date
  element.dataset.day = `${one.date}`;
  pickedIndexSpy.mockImplementationOnce(() => 1);
  actions.do(event, ActionTypes.selectDay);
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([shouldBe]);
  expectDateTimeMidnightLocal(dates.picked[0]);
  expect(hideSpy).not.toHaveBeenCalled();
});

test('clear', () => {
  const updateCalendarHeaderSpy = vi.spyOn(display, '_updateCalendarHeader');
  const setValueSpy = vi.spyOn(dates, 'setValue');

  dates.add(newDate());
  expect(dates.picked).toEqual([newDate()]);

  actions.do(event, ActionTypes.clear);
  expect(updateCalendarHeaderSpy).toHaveBeenCalled();
  expect(setValueSpy).toHaveBeenCalled();
  expect(dates.picked).toEqual([]);
});

test('close', () => {
  const hideSpy = vi.spyOn(display, 'hide');

  actions.do(event, ActionTypes.close);
  expect(hideSpy).toHaveBeenCalled();
});

test('today', () => {
  const setValueSpy = vi.spyOn(dates, 'setValue');
  const viewUpdateSpy = vi.spyOn(emitters.updateViewDate, 'emit');

  expect(dates.picked).toEqual([]);
  actions.do(event, ActionTypes.today);
  expect(setValueSpy).toHaveBeenCalled();
  expect(viewUpdateSpy).toHaveBeenCalled();
  const todayArg = setValueSpy.mock.calls.at(-1)?.[0];
  expect(todayArg).toBeDefined();
  expectDateTimeMidnightLocal(todayArg);
});

test('action emitter', () => {
  const actionSpy = vi.spyOn(emitters.action, 'emit');
  const doSpy = vi.spyOn(actions, 'do');
  doSpy.mockImplementation(vi.fn());

  emitters.action.emit({ e: {}, action: ActionTypes.close });
  expect(actionSpy).toHaveBeenCalled();
});
