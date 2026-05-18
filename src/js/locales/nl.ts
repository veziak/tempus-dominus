const name = 'nl';

const localization = {
  today: 'Vandaag',
  clear: 'Verwijder selectie',
  close: 'Sluit de picker',
  selectMonth: 'Selecteer een maand',
  previousMonth: 'Vorige maand',
  nextMonth: 'Volgende maand',
  selectYear: 'Selecteer een jaar',
  previousYear: 'Vorige jaar',
  nextYear: 'Volgende jaar',
  selectDecade: 'Selecteer decennium',
  previousDecade: 'Vorige decennium',
  nextDecade: 'Volgende decennium',
  previousCentury: 'Vorige eeuw',
  nextCentury: 'Volgende eeuw',
  selectDate: 'Selecteer een datum',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  locale: 'nl',
  startOfTheWeek: 1,
  dateFormats: {
    L: 'dd-MM-yyyy',
    LL: 'd MMMM yyyy',
  },
  ordinal: (n) => `[${n}${n === 1 || n === 8 || n >= 20 ? 'ste' : 'de'}]`,
  format: 'L',
};

export { localization, name };
