const name = 'sl';

const localization = {
  today: 'Danes',
  clear: 'Počisti',
  close: 'Zapri',
  selectMonth: 'Izberite mesec',
  previousMonth: 'Prejšnji mesec',
  nextMonth: 'Naslednji mesec',
  selectYear: 'Izberite leto',
  previousYear: 'Prejšnje Leto',
  nextYear: 'Naslednje leto',
  selectDecade: 'Izberite desetletje',
  previousDecade: 'Prejšnje desetletje',
  nextDecade: 'Naslednje desetletje',
  previousCentury: 'Prejšnje stoletje',
  nextCentury: 'Naslednje stoletje',
  pickHour: 'Izberite uro',
  selectDate: 'Izberite Datum',
  dayViewHeaderFormat: { month: 'long', year: 'numeric' },
  locale: 'sl',
  startOfTheWeek: 1,
  dateFormats: {
    LT: 'H:mm',
    LTS: 'H:mm:ss',
    L: 'dd.MM.yyyy',
    LL: 'd. MMMM yyyy',
    LLL: 'd. MMMM yyyy H:mm',
    LLLL: 'dddd, d. MMMM yyyy H:mm',
  },
  ordinal: (n) => `${n}.`,
  format: 'L LT',
};

export { localization, name };
