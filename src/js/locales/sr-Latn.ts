const name = 'sr-Latn';

const localization = {
  today: 'Danas',
  clear: 'Izbriši izbor',
  close: 'Zatvori',
  selectMonth: 'Izaberi mesec',
  previousMonth: 'Prethodni mesec',
  nextMonth: 'Sledeći mesec',
  selectYear: 'Izaberi godinu',
  previousYear: 'Prethodna godina',
  nextYear: 'Sledeća godina',
  selectDecade: 'Izaberi dekadu',
  previousDecade: 'Prethodna dekada',
  nextDecade: 'Sledeća dekada',
  previousCentury: 'Prethodni vek',
  nextCentury: 'Sledeći vek',
  selectDate: 'Izaberi datum',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  locale: 'sr-Latn',
  startOfTheWeek: 1,
  dateFormats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'D. M. YYYY.',
    LL: 'D. MMMM YYYY.',
    LLL: 'D. MMMM YYYY. H:mm',
    LLLL: 'dddd, D. MMMM YYYY. H:mm',
  },
  ordinal: (n) => `${n}.`,
  format: 'L LT',
};

export { localization, name };
