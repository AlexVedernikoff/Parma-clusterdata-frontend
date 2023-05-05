const getErrorMessageHelper = ({ type, status }) => {
  let errorMessage = '';

  switch (type) {
    case 'database-list': {
      if (status === 400) {
        errorMessage = 'Ошибка: не удалось установить соединение к подключению';
      } else if (status === 403) {
        errorMessage = 'У вас нет прав доступа к подключению';
      } else {
        errorMessage = 'Ошибка: не удалось загрузить список доступных баз данных';
      }
      break;
    }
    case 'table-list': {
      if (status === 400) {
        errorMessage = 'Ошибка: не удалось установить соединение к подключению';
      } else if (status === 403) {
        errorMessage = 'У вас нет доступа к подключению';
      } else {
        errorMessage = 'Ошибка: не удалось загрузить список доступных таблиц';
      }
      break;
    }
  }

  return errorMessage;
};

export default getErrorMessageHelper;
