export class NumberValueHelper {
  public static toLocaleString(
    value: number,
    { maximumFractionDigits } = { maximumFractionDigits: 2 },
  ): string {
    return Number(value).toLocaleString(this.locale(), { maximumFractionDigits });
  }

  private static locale() {
    if (navigator.language) {
      return navigator.language;
    }

    return 'ru-RU';
  }
}
