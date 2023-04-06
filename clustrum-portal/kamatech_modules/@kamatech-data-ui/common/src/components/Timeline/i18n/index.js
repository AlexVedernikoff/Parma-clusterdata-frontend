import { I18N } from '@kamatech-data-ui/i18n';
import en from './en.json';
import ru from './ru.json';

const i18nFactory = new I18N();

i18nFactory.registerKeyset(I18N.LANGS.ru, 'timeline', ru);
i18nFactory.registerKeyset(I18N.LANGS.en, 'timeline', en);

export default i18nFactory.keyset('timeline');
