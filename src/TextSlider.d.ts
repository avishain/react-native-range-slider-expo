/// <reference types="react" />
import { TextStyle, StyleProp } from 'react-native';
export declare type itemType = {
    value: number;
    text: string;
};
interface TextualSliderProps {
    values: itemType[];
    valueOnChange: (value: itemType) => void;
    styleSize?: 'small' | 'medium' | 'large' | number;
    knobColor?: string;
    inRangeBarColor?: string;
    outOfRangeBarColor?: string;
    valueLabelsTextColor?: string;
    valueLabelsBackgroundColor?: string;
    rangeLabelsStyle?: StyleProp<TextStyle>;
    showRangeLabels?: boolean;
    showValueLabels?: boolean;
    initialValue?: number;
}
declare const TextualSlider: ({ values, valueOnChange, styleSize, knobColor, inRangeBarColor, outOfRangeBarColor, valueLabelsTextColor, valueLabelsBackgroundColor, rangeLabelsStyle, showRangeLabels, showValueLabels, initialValue }: TextualSliderProps) => JSX.Element;
export default TextualSlider;
