export declare const osRtl: boolean;
interface UtilsParams {
    step: number;
    labelFormatter: ((value: number) => string) | undefined;
}
declare const useUtils: (params: UtilsParams) => {
    formatLabel: (value: number) => string;
    decimalRound: (num: number) => number;
};
export default useUtils;
