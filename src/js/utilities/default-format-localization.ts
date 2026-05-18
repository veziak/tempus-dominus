import { FormatLocalization } from './options';

const DefaultFormatLocalization: FormatLocalization = {
  dateFormats: {
    L: 'dd/MM/yyyy',
    LL: 'MMMM d, yyyy',
  },
  format: 'L',
  locale: 'default',
  ordinal: (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
  },
};

export default { ...DefaultFormatLocalization };
