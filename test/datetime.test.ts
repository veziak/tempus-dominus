/* eslint-disable  @typescript-eslint/ban-ts-comment */
import {
  defaultLocalization,
  newDate,
  newDateStringDate,
} from './test-utilities';
import { expect, test } from 'vitest';
import { DateTime, getFormatByUnit, Unit } from '../src/js/datetime';

test('getFormatByUnit', () => {
  expect(getFormatByUnit(Unit.date)).toEqual({ dateStyle: 'short' });
  expect(getFormatByUnit(Unit.month)).toEqual({
    month: 'numeric',
    year: 'numeric',
  });
  expect(getFormatByUnit(Unit.year)).toEqual({ year: 'numeric' });
});

test('Can create with string (ctor)', () => {
  const dt = newDate();
  expect(dt.month).toBe(2); //minus 1 because javascript 🙄
  expect(dt.date).toBe(14);
  expect(dt.year).toBe(2023);
});

test('Localization is stored', () => {
  const dt = newDate();
  expect(dt.localization).toEqual(defaultLocalization());
  const es = {
    locale: 'es',
    dateFormats: {
      L: 'dd/MM/yyyy',
      LL: 'd [de] MMMM [de] yyyy',
    },
    ordinal: (n) => `${n}º`,
    format: 'L',
  };
  dt.setLocalization(es);
  expect(dt.localization).toEqual(es);

  //check setting just the locale
  dt.localization = null;

  const fr = defaultLocalization();
  fr.locale = 'fr';
  dt.setLocale('fr');
  expect(dt.localization).toEqual(fr);
});

test('Can convert from a Date object', () => {
  const d = new Date(2022, 11, 14);
  const dt = DateTime.convert(d);

  expect(dt.valueOf()).toBe(d.valueOf());
});

test('Convert fails with no parameter', () => {
  expect(() => DateTime.convert(null)).toThrow('A date is required');
});

test('Can create with string', () => {
  expect(() => DateTime.fromString('12/31/2022', null)).toThrow(/TD/);
  const localization = defaultLocalization();
  localization.format = localization.dateFormats.L;
  const dt = DateTime.fromString('31/12/2022', localization);
  expect(dt.month).toBe(12 - 1); //minus 1 because javascript 🙄
  expect(dt.date).toBe(31);
  expect(dt.year).toBe(2022);
});

test('Can create clone', () => {
  const dt = new DateTime(2022, 11, 14);
  const d = dt.clone;

  expect(dt.valueOf()).toBe(d.valueOf());
});
test('startOf', () => {
  let dt = new DateTime(2022, 11, 14, 13, 42, 59, 500);

  dt = dt.startOf(Unit.date);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 14, 0, 0, 0).valueOf());

  dt = new DateTime(2022, 11, 14, 13, 42, 59, 500);
  dt = dt.startOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 11, 0, 0, 0).valueOf());

  dt = new DateTime(2022, 11, 14, 13, 42, 59, 500);
  dt = dt.startOf(Unit.month);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 1, 0, 0, 0).valueOf());

  dt = new DateTime(2022, 11, 14, 13, 42, 59, 500);
  dt = dt.startOf(Unit.year);
  expect(dt.valueOf()).toBe(new DateTime(2022, 0, 1, 0, 0, 0).valueOf());

  // @ts-ignore
  expect(() => dt.startOf('foo')).toThrow("Unit 'foo' is not valid");

  //skip the process of the start of the week is the same weekday
  dt = new DateTime(2022, 11, 25, 0, 0, 0);
  dt = dt.startOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 25, 0, 0, 0).valueOf());

  //check if weekday works when the week doesn't start on Sunday
  dt = new DateTime(2022, 11, 18, 0, 0, 0);
  dt = dt.startOf('weekDay', 1);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 12, 0, 0, 0).valueOf());
});

test('endOf', () => {
  let dt = new DateTime(2022, 11, 14, 13, 42, 59, 50);

  dt = dt.endOf(Unit.date);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 14, 23, 59, 59, 999).valueOf());

  dt = new DateTime(2022, 11, 14, 13, 42, 59, 50);
  dt = dt.endOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 17, 23, 59, 59, 999).valueOf());

  dt = new DateTime(2022, 11, 14, 13, 42, 59, 50);
  dt = dt.endOf(Unit.month);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 31, 23, 59, 59, 999).valueOf());

  dt = new DateTime(2022, 11, 14, 13, 42, 59, 50);
  dt = dt.endOf(Unit.year);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 31, 23, 59, 59, 999).valueOf());

  // @ts-ignore
  expect(() => dt.endOf('foo')).toThrow("Unit 'foo' is not valid");

  //skip the process if the end of the week is the same weekday
  dt = new DateTime(2022, 11, 17, 0, 0, 0);
  dt = dt.endOf('weekDay');
  expect(dt.valueOf()).toBe(new Date(2022, 11, 17, 23, 59, 59, 999).valueOf());

  //check if weekday works when the week doesn't start on Sunday
  dt = new DateTime(2022, 11, 14, 0, 0, 0);
  dt = dt.endOf('weekDay', 1);
  expect(dt.valueOf()).toBe(new Date(2022, 11, 18, 23, 59, 59, 999).valueOf());
});

test('manipulate throws an error with invalid part', () => {
  // @ts-ignore
  expect(() => newDate().manipulate(1, 'foo')).toThrow(
    "Unit 'foo' is not valid"
  );
});

test('Format should return formatted date', () => {
  const dt = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt.format({ dateStyle: 'full' })).toBe('Saturday, December 17, 2022');
});

test('isBefore', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const dt2 = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt1.isBefore(dt2)).toBe(true);

  expect(dt1.isBefore(dt2, Unit.date)).toBe(true);

  // @ts-ignore
  expect(() => dt1.isBefore(dt2, 'foo')).toThrow("Unit 'foo' is not valid");

  //compare date is not valid
  expect(dt1.isBefore(undefined, Unit.date)).toBe(false);
});

test('isAfter', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const dt2 = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt2.isAfter(dt1)).toBe(true);

  expect(dt2.isAfter(dt1, Unit.date)).toBe(true);

  // @ts-ignore
  expect(() => dt2.isAfter(dt1, 'foo')).toThrow("Unit 'foo' is not valid");

  //compare date is not valid
  expect(dt1.isAfter(undefined, Unit.date)).toBe(false);
});

test('isSame', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const dt2 = new DateTime(2022, 11, 16, 0, 0, 0);

  expect(dt1.isSame(dt2)).toBe(true);

  expect(dt1.isSame(dt2, Unit.date)).toBe(true);

  //if the compare date is invalid
  expect(dt1.isSame(undefined, Unit.date)).toBe(false);

  // @ts-ignore
  expect(() => dt1.isSame(dt2, 'foo')).toThrow("Unit 'foo' is not valid");
});

//todo this is missing some conditions: https://github.com/moment/moment/blob/master/src/test/moment/is_between.js
//but it hurts my brain
test('isBetween', () => {
  const dt1 = new DateTime(2022, 11, 16, 0, 0, 0);
  const left = new DateTime(2022, 11, 15, 0, 0, 0);
  const right = new DateTime(2022, 11, 17, 0, 0, 0);

  expect(dt1.isBetween(left, right)).toBe(true);

  expect(dt1.isBetween(left, right, Unit.date)).toBe(true);

  // @ts-ignore
  expect(() => dt1.isBetween(left, right, 'foo')).toThrow(
    "Unit 'foo' is not valid"
  );

  const dateTime = new DateTime('2016-10-30');

  expect(
    dateTime.isBetween(dateTime, new DateTime('2016-12-30'), undefined, '()')
  ).toBe(false);
  expect(dateTime.isBetween(dateTime, dateTime, undefined, '[]')).toBe(true);
  expect(
    dateTime.isBetween(new DateTime('2016-01-01'), dateTime, undefined, '(]')
  ).toBe(true);
  expect(
    dateTime.isBetween(dateTime, new DateTime('2016-12-30'), undefined, '[)')
  ).toBe(true);

  //compare date is not valid
  expect(dt1.isBetween(undefined, undefined, Unit.date)).toBe(false);

  //Unit is not valid
  // @ts-ignore
  expect(() => dt1.isBetween(dateTime, newDate(), 'foo')).toThrow(
    "Unit 'foo' is not valid"
  );
});

test('Getters/Setters', () => {
  const dt = new DateTime(2022, 11, 17, 0, 0, 0);

  dt.date = 4;

  expect(dt.date).toBe(4);
  expect(dt.dateFormatted).toBe('04');

  dt.month = 4;

  expect(dt.month).toBe(4);
  expect(dt.monthFormatted).toBe('05');

  //test date bubbling. JS doesn't handle a date of May 31st => June 31st but DateTime does.
  dt.date = 31;
  dt.month = 5;
  expect(dt.monthFormatted).toBe('06');

  dt.year = 2023;

  expect(dt.year).toBe(2023);

  expect(dt.week).toBe(26);

  dt.year = 2004;

  expect(dt.weeksInWeekYear()).toBe(53);

  dt.year = 2017;

  expect(dt.weeksInWeekYear()).toBe(52);

  dt.year = 2020;

  expect(dt.weeksInWeekYear()).toBe(53);

  dt.year = 2000;
  expect(dt.isLeapYear).toBe(true);
  expect(dt.week).toBe(26);

  dt.year = 2024;
  expect(dt.isLeapYear).toBe(true);

  dt.year = 2023;
  expect(dt.isLeapYear).toBe(false);

  dt.year = 2026;
  expect(dt.weeksInWeekYear()).toBe(53);
});

test('Get ALl Months', () => {
  // @ts-ignore
  const months = newDate().getAllMonths();
  expect(months).toEqual([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]);
});

test('parseTwoDigitYear', () => {
  const dateTime = newDate();
  // @ts-ignore
  let parsed = dateTime.parseTwoDigitYear(70);

  expect(parsed).toBe(1970);

  // @ts-ignore
  parsed = dateTime.parseTwoDigitYear(23);

  expect(parsed).toBe(2023);
});

test('expressions', () => {
  const dateTime = newDate();
  // @ts-ignore
  const e = { ...dateTime.expressions };
  // @ts-ignore
  const matchWord = dateTime.matchWord;
  // @ts-ignore
  const match2 = dateTime.match2;
  // @ts-ignore
  const match4 = dateTime.match4;
  // @ts-ignore
  const match1to2 = dateTime.match1to2;
  // @ts-ignore
  const matchSigned = dateTime.matchSigned;

  const o: any = {};

  expect(e.d.pattern).toBe(match1to2);

  e.d.parser(o, 15);

  expect(o.day).toBe(15);

  expect(e.dd.pattern).toBe(match2);

  e.dd.parser(o, 16);

  expect(o.day).toBe(16);

  expect(e.Do.pattern).toBe(matchWord);

  e.Do.parser(o, '1st');

  expect(o.day).toBe(1);

  dateTime.localization.ordinal = undefined;

  e.Do.parser(o, '1st');

  expect(o.day).toBe(1);

  dateTime.localization.ordinal = defaultLocalization().ordinal;

  //#region Months

  expect(e.M.pattern).toBe(match1to2);

  e.M.parser(o, 5);

  expect(o.month).toBe(5);

  expect(e.MM.pattern).toBe(match2);

  e.MM.parser(o, 7);

  expect(o.month).toBe(7);

  expect(e.MMM.pattern).toBe(matchWord);

  e.MMM.parser(o, 'Jan');

  expect(o.month).toBe(1);

  expect(e.MMMM.pattern).toBe(matchWord);

  e.MMMM.parser(o, 'January');

  expect(o.month).toBe(1);

  //#endregion

  //#region Year

  expect(e.y.pattern).toBe(matchSigned);

  e.y.parser(o, 2000);

  expect(o.year).toBe(2000);

  expect(e.yy.pattern).toBe(match2);

  e.yy.parser(o, 20);

  expect(o.year).toBe(2020);

  expect(e.yyyy.pattern).toBe(match4);

  e.yyyy.parser(o, 2023);

  expect(o.year).toBe(2023);

  //#endregion
});

test('format', () => {
  const dateTime = newDate();
  expect(dateTime.format()).toBe(newDateStringDate);

  expect(dateTime.format('dd-MMM-yyyy')).toBe('14-Mar-2023');

  //test failure if no format
  expect(() => DateTime.fromString('', undefined)).toThrow(
    'TD: Custom Date Format: No format was provided'
  );

  expect(DateTime.fromString('01-Mar-2023', { format: 'dd-MMM-yyyy' })).toEqual(
    new DateTime(2023, 3 - 1, 1, 0, 0, 0, 0)
  );

  //test epoch seconds
  expect(DateTime.fromString('1678814742', { format: 'X' }).getTime()).toBe(
    1678814742000
  );

  //test epoch millisecond
  expect(DateTime.fromString('1678814742500', { format: 'x' }).getTime()).toBe(
    1678814742500
  );

  //test invalid input
  expect(() => DateTime.fromString('xx', { format: 'dd' })).toThrow(
    /TD: Custom Date Format: Unable to parse/
  );

  //test no format for defaults
  const dt2 = newDate();
  dt2.localization.format = undefined;
  expect(dt2.format()).toBe('14/03/2023');
});

test('isValid', () => {
  expect(DateTime.isValid('asdf')).toBe(false);
  expect(DateTime.isValid(undefined)).toBe(false);
  expect(DateTime.isValid(newDate())).toBe(true);
});
