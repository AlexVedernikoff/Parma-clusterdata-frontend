// @ts-ignore
import { BreadcrumbItem } from '@entities/header';

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
      return text as string;
  }
};

export function navigationItems(place: string, path: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  if (place) {
    items.push({
      title: translateText(place),
    });
  }

  if (path) {
    const pathItems = path.split('/').filter(item => item !== '');
    items.push(
      ...pathItems.map(item => ({
        title: translateText(item),
      })),
    );
  }

  return items;
}

export function formatPath(path: string): string {
  const pathItems: string[] = translateText(path)
    .split('/')
    .filter(item => item !== '');

  return pathItems[pathItems.length - 1];
}
