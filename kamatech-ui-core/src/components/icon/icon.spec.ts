import { IconModel } from '..'

describe('Icon', () => {
  const model1 = new IconModel({
    data: { viewBox: '0 0 32 32', url: '/url' },
  })
  const model2 = new IconModel({
    data: { viewBox: '0 0 32 32', id: 'id' },
    width: 48,
    height: 48,
  })
  const model3 = new IconModel({
    data: { viewBox: '0 0 32 32', url: '/url', id: 'id' },
    prefix: 'prefix',
  })

  it('Отображаемая ширина без width', () => {
    expect(model1.viewWidth).toBe(32)
  })

  it('Отображаемая ширина с width', () => {
    expect(model2.viewWidth).toBe(48)
  })

  it('Отображаемая высота без height', () => {
    expect(model1.viewHeight).toBe(32)
  })

  it('Отображаемая высота с height', () => {
    expect(model2.viewHeight).toBe(48)
  })

  it('Значение по умолчанию для fill', () => {
    expect(model1.fill).toBe(IconModel.fill)
  })

  it('Значение по умолчанию для stroke', () => {
    expect(model1.stroke).toBe(IconModel.stroke)
  })

  it('Значение xlinkHref для url', () => {
    expect(model1.xlinkHref).toBe('/url')
  })

  it('Значение xlinkHref для id', () => {
    expect(model2.xlinkHref).toBe('#id')
  })

  it('Значение xlinkHref при заданных url, id, prefix', () => {
    expect(model3.xlinkHref).toBe('prefix/url')
  })
})
