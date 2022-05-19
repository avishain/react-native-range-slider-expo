import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
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
    containerStyle?: ViewStyle;
    knobBubbleTextStyle?: TextStyle;
    labelFormatter?: (value: number) => string;
}
export declare const Slider: React.ComponentType<SliderProps>;
export {};
