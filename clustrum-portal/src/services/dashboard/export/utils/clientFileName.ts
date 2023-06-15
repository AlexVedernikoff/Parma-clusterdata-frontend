import moment from 'moment';

const MAX_ENTRY_NAME_LENGTH = 100;
const MAX_TAB_TITLE_LENGTH = 60;

const limitStringLength = (str: string, limit: number) => {
  return str.length > limit ? str.substring(0, limit) + '...' : str;
};

const generateDate = () => {
  return moment().format('DD.MM.YYYY HH-mm-ss');
};

export const clientFileName = (entryName: string, tabTitle = '') => {
  const trimmedEntryName = limitStringLength(entryName, MAX_ENTRY_NAME_LENGTH);

  return tabTitle
    ? `${trimmedEntryName} (${limitStringLength(
        tabTitle,
        MAX_TAB_TITLE_LENGTH,
      )}) ${generateDate()}`
    : `${trimmedEntryName} ${generateDate()}`;
};
