import { useCallback, useMemo } from "react";
import { I18nManager } from "react-native";

export const osRtl = I18nManager.isRTL;

interface UtilsParams {
  step: number;
}

const useUtils = (params: UtilsParams) => {
  const {step} = params;

  const countDecimals = useCallback((num: number) => {
    if (Math.floor(num.valueOf()) === num.valueOf()) return 0;
    return num.toString().split(".")[1].length || 0;
  }, []);
  
  const decimals = useMemo(() => countDecimals(step), [step, countDecimals]);

  const decimalRound = (num: number) => {
    const m = 10 ** decimals;
    return Math.round(num * m) / m;
  }

  return {decimals, decimalRound}
}

export default useUtils;
