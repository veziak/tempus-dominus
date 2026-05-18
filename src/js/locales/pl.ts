const name = 'pl';

const localization = {
  today: 'Dzisiaj',
  clear: 'Wyczyść',
  close: 'Zamknij',
  selectMonth: 'Wybierz miesiąc',
  previousMonth: 'Poprzedni miesiąc',
  nextMonth: 'Następny miesiąc',
  selectYear: 'Wybierz rok',
  previousYear: 'Poprzedni rok',
  nextYear: 'Następny rok',
  selectDecade: 'Wybierz dekadę',
  previousDecade: 'Poprzednia dekada',
  nextDecade: 'Następna dekada',
  previousCentury: 'Poprzednie stulecie',
  nextCentury: 'Następne stulecie',
  selectDate: 'Ustaw datę',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  locale: 'pl',
  startOfTheWeek: 1,
  dateFormats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'dd.MM.yyyy',
    LL: 'd MMMM yyyy',
    LLL: 'd MMMM yyyy HH:mm',
    LLLL: 'dddd, d MMMM yyyy HH:mm',
  },
  ordinal: (n) => `${n}.`,
  format: 'L LT',
};

export { localization, name };
