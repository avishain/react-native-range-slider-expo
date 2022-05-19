import React from 'react';
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
declare const TextualSlider: React.ComponentType<TextualSliderProps>;
export default TextualSlider;
