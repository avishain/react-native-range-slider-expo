import { I18nManager } from "react-native";

export const osRtl = I18nManager.isRTL;

export function countDecimals(num: number) {
  if (Math.floor(num.valueOf()) === num.valueOf()) return 0;
  return num.toString().split(".")[1].length || 0;
}
