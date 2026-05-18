import { DateTime, DateTimeFormatOptions } from '../datetime';
import ViewMode from './view-mode';

export default interface Options {
  allowInputToggle?: boolean;
  container?: HTMLElement;
  dateRange?: boolean;
  debug?: boolean;
  defaultDate?: DateTime;
  display?: {
    keyboardNavigation?: boolean;
    toolbarPlacement?: 'top' | 'bottom';
    components?: {
      calendar?: boolean;
      date?: boolean;
      month?: boolean;
      year?: boolean;
      decades?: boolean;
    };
    buttons?: { today?: boolean; close?: boolean; clear?: boolean };
    calendarWeeks?: boolean;
    icons?: {
      clear?: string;
      close?: string;
      date?: string;
      down?: string;
      next?: string;
      previous?: string;
      today?: string;
      type?: 'icons' | 'sprites';
      up?: string;
    };
    viewMode?: keyof ViewMode;
    sideBySide?: boolean;
    inline?: boolean;
    keepOpen?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    placement?: 'top' | 'bottom';
  };
  keepInvalid?: boolean;
  localization?: Localization;
  meta?: Record<string, unknown>;
  multipleDates?: boolean;
  multipleDatesSeparator?: string;
  restrictions?: {
    minDate?: DateTime;
    maxDate?: DateTime;
    enabledDates?: DateTime[];
    disabledDates?: DateTime[];
    daysOfWeekDisabled?: number[];
  };
  useCurrent?: boolean;
  viewDate?: DateTime;
}

export interface FormatLocalization {
  dateFormats?: {
    L?: string;
    LL?: string;
  };
  format?: string;
  locale?: string;
  ordinal?: (n: number) => any; //eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Localization extends FormatLocalization {
  clear?: string;
  close?: string;
  dayViewHeaderFormat?: DateTimeFormatOptions;
  maxWeekdayLength?: number;
  nextCentury?: string;
  nextDecade?: string;
  nextMonth?: string;
  nextYear?: string;
  previousCentury?: string;
  previousDecade?: string;
  previousMonth?: string;
  previousYear?: string;
  selectDate?: string;
  selectDecade?: string;
  selectMonth?: string;
  selectYear?: string;
  startOfTheWeek?: number;
  today?: string;
  toggleAriaLabel?: string;
}
