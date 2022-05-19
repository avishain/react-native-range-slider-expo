import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
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
    knobBubbleTextStyle?: TextStyle;
    valueLabelsBackgroundColor?: string;
    rangeLabelsTextColor?: string;
    showRangeLabels?: boolean;
    showValueLabels?: boolean;
    initialFromValue?: number;
    initialToValue?: number;
    knobSize?: number;
    containerStyle?: ViewStyle;
    barHeight?: number;
    labelFormatter?: (value: number) => string;
}
declare const _default: React.ComponentType<SliderProps>;
export default _default;
