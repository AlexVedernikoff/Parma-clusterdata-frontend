
export interface ParmaRangePicker {
    min?: number;
    max?: number;
    step?: number;
    initialValue?: number;
    onChange: (value: number) => any;
}
