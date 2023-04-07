import { NavigationBreadcrumbsModel } from './navigation-breadcrumbs.model'
import { NavigationPlace } from '../navigation-place.enum'

describe('NavigationBreadcrumbs', () => {
  const model1 = new NavigationBreadcrumbsModel()
  const model2 = new NavigationBreadcrumbsModel({
    path: 'root/test',
    place: NavigationPlace.Root,
    getPlaceParameters: () => ({ text: 'text' }),
  })
  const model3 = new NavigationBreadcrumbsModel({
    path: 'root/test',
    place: 'error',
    getPlaceParameters: () => ({ text: 'text' }),
  })

  it('Значения по умолчанию: size, path, place', () => {
    expect(model1.size).toBe(NavigationBreadcrumbsModel.size)
    expect(model1.path).toBe(NavigationBreadcrumbsModel.path)
    expect(model1.place).toBe(NavigationBreadcrumbsModel.place)
  })

  it('Катаоги по пути', () => {
    expect(model2.getFolderNameByPathMap()).toStrictEqual([
      { name: 'root', path: 'root/' },
      { name: 'test', path: 'root/test/' },
    ])
  })

  it('Катаоги пусты', () => {
    expect(model1.getFolderParts()).toStrictEqual([])
  })

  it('Катаоги', () => {
    expect(model2.getFolderParts()).toStrictEqual([
      { name: 'text', path: '' },
      { name: 'root', path: 'root/' },
      { name: 'test', path: 'root/test/' },
    ])
  })

  it('Катаоги с нераспознанным place', () => {
    expect(model3.getFolderParts()).toStrictEqual([{ name: 'text', path: '' }])
  })
})
