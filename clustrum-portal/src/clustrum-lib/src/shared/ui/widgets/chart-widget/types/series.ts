export interface SeriesData {
  y: string | number;
  label?: string | number;
  originalCategory: string;
  name?: string;
  valueWithFormat?: number;
}

export interface Series {
  title: string;
  data: SeriesData[];
  legendTitle: string;
  colorValue: null;
  color: string;
  stack: null;
  name: string;
}
