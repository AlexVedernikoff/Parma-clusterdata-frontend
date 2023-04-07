export class UnitsHelper {
  static isNull(value: any): boolean {
    return value === null
  }

  static isUndefined(value: any): boolean {
    return value === undefined
  }

  static isNullOrUndefined(value: any): boolean {
    return UnitsHelper.isNull(value) || UnitsHelper.isUndefined(value)
  }

  static isString(value: any): boolean {
    return typeof value === 'string'
  }

  static isNumber(value: any): boolean {
    return typeof value === 'number'
  }

  static convertToNumber(value: number | string | undefined): number {
    let result = 0
    if (UnitsHelper.isNullOrUndefined(value)) {
      return result
    }

    if (UnitsHelper.isString(value)) {
      result = parseFloat(value as string)
    }

    if (UnitsHelper.isNumber(value)) {
      result = value as number
    }

    return Number.isNaN(result) ? 0 : result
  }
}
