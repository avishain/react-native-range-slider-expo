/// <reference types="react" />
interface SliderProps {
    min: number;
    max: number;
    fromValueOnChange: (value: number) => void;
    toValueOnChange: (value: number) => void;
    step?: number;
    styleSize?: 'small' | 'medium' | 'large' | number;
    fromKnobColor?: string;
    toKnobColor?: string;
    inRangeBarColor?: string;
    outOfRangeBarColor?: string;
    valueLabelsTextColor?: string;
    valueLabelsBackgroundColor?: string;
    rangeLabelsTextColor?: string;
    showRangeLabels?: boolean;
    showValueLabels?: boolean;
    initialFromValue?: number;
    initialToValue?: number;
}
declare const _default: ({ min, max, fromValueOnChange, toValueOnChange, step, styleSize, fromKnobColor, toKnobColor, inRangeBarColor, outOfRangeBarColor, valueLabelsTextColor, valueLabelsBackgroundColor, rangeLabelsTextColor, showRangeLabels, showValueLabels, initialFromValue, initialToValue }: SliderProps) => JSX.Element;
export default _default;
