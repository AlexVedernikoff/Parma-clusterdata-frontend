import { BreadcrumbItem } from '../../../../../../../src/entities/header/types/breadcrumbItem';

const translateText = (text: string | undefined): string => {
  switch (text) {
    case 'root':
      return 'Все объекты';
    case 'favorites':
      return 'Избранное';
    case 'connections':
    case 'connection':
      return 'Подключения';
    case 'datasets':
    case 'dataset':
      return 'Наборы данных';
    case 'widgets':
    case 'widget':
      return 'Диаграммы';
    case 'dashboards':
    case 'dash':
      return 'Аналитические панели';
    default:
      return <string>text;
  }
};

export function navigationItems(place: string, path: string): BreadcrumbItem[] {
  return [
    {
      title: translateText(place),
    },
    ...path
      .split('/')
      .filter(item => item !== '')
      .map(item => ({
        title: translateText(item),
      })),
  ];
}

export function formatPath(path: string): string {
  const pathItems: string[] = translateText(path)
    .split('/')
    .filter(item => item !== '');

  return pathItems[pathItems.length - 1];
}
