import ExtensionsManager, {EXTENSION_KEY} from '../modules/extensions-manager/extensions-manager';

import holidays from '../modules/holidays/holidays';

export default function () {
    ExtensionsManager.add(EXTENSION_KEY.HOLIDAYS, holidays);
}
