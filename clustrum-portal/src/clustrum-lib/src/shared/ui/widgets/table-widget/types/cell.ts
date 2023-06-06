export const NULL_ALIAS = 'null';

export interface Cell {
  type: string;
  value: any;
  link: {
    href: string;
    newWindow: boolean;
  };
  grid: Cell[];
  valueWithAlias: typeof NULL_ALIAS | null;
  hasArray: boolean;
  resultShemaId: string;
}
