import { DateTime, Unit } from './datetime';
import Namespace from './utilities/namespace';
import Dates from './dates';
import Validation from './validation';
import Display from './display';
import { EventEmitters } from './utilities/event-emitter';
import { serviceLocator } from './utilities/service-locator.js';
import ActionTypes from './utilities/action-types';
import CalendarModes from './utilities/calendar-modes';
import { OptionsStore } from './utilities/optionsStore';

/**
 * Logic for various click actions
 */
export default class Actions {
  private optionsStore: OptionsStore;
  private validation: Validation;
  private dates: Dates;
  private display: Display;
  private _eventEmitters: EventEmitters;

  constructor() {
    this.optionsStore = serviceLocator.locate(OptionsStore);
    this.dates = serviceLocator.locate(Dates);
    this.validation = serviceLocator.locate(Validation);
    this.display = serviceLocator.locate(Display);
    this._eventEmitters = serviceLocator.locate(EventEmitters);

    this._eventEmitters.action.subscribe((result) => {
      this.do(result.e, result.action);
    });
  }

  /**
   * Performs the selected `action`. See ActionTypes
   * @param e This is normally a click event
   * @param action If not provided, then look for a [data-action]
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  do(e: any, action?: ActionTypes) {
    const currentTarget = e?.currentTarget as HTMLElement;
    if (currentTarget?.classList?.contains(Namespace.css.disabled)) return;
    action = action || (currentTarget?.dataset?.action as ActionTypes);

    switch (action) {
      case ActionTypes.next:
      case ActionTypes.previous:
        this.handleNextPrevious(action);
        break;
      case ActionTypes.changeCalendarView:
        this.display._showMode(1);
        this.display._updateCalendarHeader();
        break;
      case ActionTypes.selectMonth:
      case ActionTypes.selectYear:
      case ActionTypes.selectDecade:
        this.handleSelectCalendarMode(action, currentTarget);
        break;
      case ActionTypes.selectDay:
        this.handleSelectDay(currentTarget);
        break;
      case ActionTypes.clear:
        this.dates.setValue(null);
        this.display._updateCalendarHeader();
        break;
      case ActionTypes.close:
        this.display.hide();
        break;
      case ActionTypes.today: {
        const day = new DateTime().setLocalization(
          this.optionsStore.options.localization
        );
        day.startOf(Unit.date);
        this._eventEmitters.updateViewDate.emit(day);

        if (!this.validation.isValid(day, Unit.date)) break;

        if (this.optionsStore.options.dateRange) this.handleDateRange(day);
        else if (this.optionsStore.options.multipleDates) {
          this.handleMultiDate(day);
        } else {
          this.dates.setValue(day, this.dates.lastPickedIndex);
        }
        break;
      }
    }
  }

  private handleNextPrevious(action: ActionTypes) {
    const { unit, step } =
      CalendarModes[this.optionsStore.currentCalendarViewMode];
    if (action === ActionTypes.next)
      this.optionsStore.viewDate.manipulate(step, unit);
    else this.optionsStore.viewDate.manipulate(step * -1, unit);
    this._eventEmitters.viewUpdate.emit();

    this.display._showMode();
  }

  private handleSelectCalendarMode(
    action:
      | ActionTypes.selectMonth
      | ActionTypes.selectYear
      | ActionTypes.selectDecade,
    currentTarget: HTMLElement
  ) {
    const value = +currentTarget.dataset.value;
    switch (action) {
      case ActionTypes.selectMonth:
        this.optionsStore.viewDate.month = value;
        break;
      case ActionTypes.selectYear:
      case ActionTypes.selectDecade:
        this.optionsStore.viewDate.year = value;
        break;
    }

    if (
      this.optionsStore.currentCalendarViewMode ===
      this.optionsStore.minimumCalendarViewMode
    ) {
      this.dates.setValue(
        this.optionsStore.viewDate.clone.startOf(Unit.date),
        this.dates.lastPickedIndex
      );

      if (!this.optionsStore.options.display.inline) {
        this.display.hide();
      }
    } else {
      this.display._showMode(-1);
    }
  }

  private handleSelectDay(currentTarget: HTMLElement) {
    const day = this.optionsStore.viewDate.clone;
    if (currentTarget.classList.contains(Namespace.css.old)) {
      day.manipulate(-1, Unit.month);
    }
    if (currentTarget.classList.contains(Namespace.css.new)) {
      day.manipulate(1, Unit.month);
    }

    day.date = +currentTarget.dataset.day;
    day.startOf(Unit.date);
    if (this.optionsStore.options.dateRange) this.handleDateRange(day);
    else if (this.optionsStore.options.multipleDates) {
      this.handleMultiDate(day);
    } else {
      this.dates.setValue(day, this.dates.lastPickedIndex);
    }

    if (
      !this.optionsStore.options.display.keepOpen &&
      !this.optionsStore.options.display.inline &&
      !this.optionsStore.options.multipleDates &&
      !this.optionsStore.options.dateRange
    ) {
      this.display.hide();
    }
  }

  private handleMultiDate(day: DateTime) {
    let index = this.dates.pickedIndex(day, Unit.date);
    if (index !== -1) {
      this.dates.setValue(null, index); //deselect multi-date
    } else {
      index = this.dates.lastPickedIndex + 1;
      if (this.dates.picked.length === 0) index = 0;

      this.dates.setValue(day, index);
    }
  }

  private handleDateRange(day: DateTime) {
    switch (this.dates.picked.length) {
      case 2: {
        this.dates.clear();
        break;
      }
      case 1: {
        const other = this.dates.picked[0];
        if (day.isSame(other, Unit.date)) {
          this.dates.clear();
          break;
        }
        const otherDay = other.clone.startOf(Unit.date);
        if (day.isBefore(otherDay)) {
          this.dates.setValue(day, 0);
          this.dates.setValue(otherDay, 1);
          return;
        } else {
          this.dates.setValue(otherDay, 0);
          this.dates.setValue(day, 1);
          return;
        }
      }
    }

    this.dates.setValue(day, 0);
  }
}
