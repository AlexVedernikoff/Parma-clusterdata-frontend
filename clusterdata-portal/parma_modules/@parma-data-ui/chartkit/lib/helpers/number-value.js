export default class NumberValue {

    static toLocaleString(value, { maximumFractionDigits } = { maximumFractionDigits: 2 }) {
        return Number(value).toLocaleString(undefined, { maximumFractionDigits });
    }

}