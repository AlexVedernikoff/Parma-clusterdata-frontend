export class ClassHelper {
  static merge(...args: string[]): string {
    return args.filter(Boolean).join(' ');
  }
}
