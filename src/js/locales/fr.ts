const name = 'fr';

const localization = {
  today: "Aujourd'hui",
  clear: 'Effacer la sélection',
  close: 'Fermer',
  selectMonth: 'Sélectionner le mois',
  previousMonth: 'Mois précédent',
  nextMonth: 'Mois suivant',
  selectYear: "Sélectionner l'année",
  previousYear: 'Année précédente',
  nextYear: 'Année suivante',
  selectDecade: 'Sélectionner la décennie',
  previousDecade: 'Décennie précédente',
  nextDecade: 'Décennie suivante',
  previousCentury: 'Siècle précédente',
  nextCentury: 'Siècle suivante',
  selectDate: 'Sélectionner une date',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  locale: 'fr',
  startOfTheWeek: 1,
  dateFormats: {
    L: 'dd/MM/yyyy',
    LL: 'd MMMM yyyy',
  },
  ordinal: (n) => {
    const o = n === 1 ? 'er' : '';
    return `${n}${o}`;
  },
  format: 'L',
};

export { localization, name };
