import {
  newDate,
  vanillaDate,
  secondaryDate,
  defaultLocalization,
} from '../test-utilities';
import { expect, test, vi } from 'vitest';
import {
  convertToDateTime,
  tryConvertToDateTime,
  typeCheckDateArray,
} from '../../src/js/utilities/typeChecker';
import { DateTime } from '../../src/js/datetime';

test('tryConvertToDateTime', () => {
  const convertSpy = vi.spyOn(DateTime, 'convert');
  convertSpy.mockImplementation(() => newDate());

  const fromStringSpy = vi.spyOn(DateTime, 'fromString');
  fromStringSpy.mockImplementationOnce(() => newDate());

  const locDate = { ...defaultLocalization(), format: 'L' };

  //null should return null
  expect(tryConvertToDateTime(null, null)).toBe(null);

  //a DateTime object should just return itself
  expect(tryConvertToDateTime(newDate(), null)).toEqual(newDate());

  //a Data object should get converted
  expect(tryConvertToDateTime(vanillaDate(), null)).toEqual(newDate());
  expect(convertSpy).toHaveBeenCalled();

  //converting from string
  expect(tryConvertToDateTime('14/03/2023', locDate)).toEqual(newDate());
  expect(fromStringSpy).toHaveBeenCalled();

  // converting from an invalid string will produce an invalid date
  fromStringSpy.mockImplementationOnce((a) => new DateTime(a));
  expect(tryConvertToDateTime('31/02/2023', locDate)).toBe(null);
  expect(fromStringSpy).toHaveBeenCalled();

  // an invalid type should return null
  // @ts-ignore
  expect(tryConvertToDateTime(42, null)).toBe(null);
});

test('convertToDateTime', () => {
  //can't convert empty string
  expect(() => convertToDateTime('', 'maxDate', null)).toThrow();

  //js date should convert
  expect(convertToDateTime(vanillaDate(), null, null)).toEqual(newDate());
});

test('typeCheckDateArray', () => {
  const locDate = { ...defaultLocalization(), format: 'L' };
  //wrong data type
  expect(() => typeCheckDateArray('disabledDates', 42, '', null)).toThrow();

  //check each excepted type for conversion
  const dateArray = [newDate(), vanillaDate(), secondaryDate().format('L')];

  typeCheckDateArray('disabledDates', dateArray, '', locDate);

  expect(dateArray[0]).toEqual(newDate());
  expect(dateArray[1]).toEqual(vanillaDate());
  expect(dateArray[2]).toEqual(secondaryDate());

  //invalid type should throw
  expect(() => typeCheckDateArray('', [42], null)).toThrow();
});
