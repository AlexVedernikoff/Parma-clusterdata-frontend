import ExtensionsManager from '../modules/extensions-manager/extensions-manager';

import {WIDGET_TYPE} from '../components/Widget/Widget';
import YandexMap from '../components/Widget/YandexMap/YandexMap';

export default function () {
    ExtensionsManager.add(WIDGET_TYPE.YMAP, YandexMap);
}
