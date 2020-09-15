/// <reference types="react" />
interface SliderProps {
    min: number;
    max: number;
    valueOnChange: (value: number) => void;
    step?: number;
    styleSize?: 'small' | 'medium' | 'large' | number;
    knobColor?: string;
    inRangeBarColor?: string;
    outOfRangeBarColor?: string;
    valueLabelsTextColor?: string;
    valueLabelsBackgroundColor?: string;
    rangeLabelsTextColor?: string;
    showRangeLabels?: boolean;
    showValueLabels?: boolean;
    initialValue?: number;
}
export declare const Slider: ({ min, max, valueOnChange, step, styleSize, knobColor, inRangeBarColor, outOfRangeBarColor, valueLabelsTextColor, valueLabelsBackgroundColor, rangeLabelsTextColor, showRangeLabels, showValueLabels }: SliderProps) => JSX.Element;
export {};
