export interface CellStyle {
  align: string;
}

export interface TableWidget {
  cell: {
    numberType: CellStyle;
    textType: CellStyle;
    dateType: CellStyle;
  };
}
