module.exports = {
  user2: {
    'add-account': 'Добавить аккаунт',
    'edit-accounts': 'Редактировать список',
    enter: 'Войти',
    exit: 'Выйти',
    help: 'Помощь',
    mail: function(params) {
      var plural = require('webpack-bem-i18n-loader/plural/ru.js');
      return plural({
        count: params.count,
        one: 'новое письмо',
        some: 'новых письма',
        many: 'новых писем',
        none: 'Нет новых писем',
      });
    },
    mail_compose: 'Написать письмо',
    passport: 'Управление аккаунтом',
    settings: 'Настройки',
    upload_files: 'Мой диск',
    ya_plus: 'Получить Плюс',
    ya_plus_on: 'Плюс',
  },
};
