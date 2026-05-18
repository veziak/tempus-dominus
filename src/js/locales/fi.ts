const name = 'fi';

const localization = {
  today: 'Tänään',
  clear: 'Tyhjennä',
  close: 'Sulje',
  selectMonth: 'Valitse kuukausi',
  previousMonth: 'Edellinen kuukausi',
  nextMonth: 'Seuraava kuukausi',
  selectYear: 'Valitse vuosi',
  previousYear: 'Edellinen vuosi',
  nextYear: 'Seuraava vuosi',
  selectDecade: 'Valitse vuosikymmen',
  previousDecade: 'Edellinen vuosikymmen',
  nextDecade: 'Seuraava vuosikymmen',
  previousCentury: 'Edellinen vuosisata',
  nextCentury: 'Seuraava vuosisata',
  pickHour: 'Valitse tunnit',
  selectDate: 'Valise päivä',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  locale: 'fi',
  startOfTheWeek: 1,
  dateFormats: {
    LT: 'HH.mm',
    LTS: 'HH.mm.ss',
    L: 'dd.MM.yyyy',
    LL: 'd. MMMM[ta] yyyy',
    LLL: 'd. MMMM[ta] yyyy, [klo] HH.mm',
    LLLL: 'dddd, d. MMMM[ta] yyyy, [klo] HH.mm',
  },
  ordinal: (n) => `${n}.`,
  format: 'L LT',
};

export { localization, name };
