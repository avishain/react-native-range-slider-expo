import React from 'react';
import { Animated, TextInput, TextStyle } from 'react-native';
import { Color } from 'react-native-svg';
interface KnobProps {
    translateX: Animated.Value;
    scale: Animated.Value;
    knobSize: number;
    textInputRef: React.RefObject<TextInput>;
    valueLabelsBackgroundColor: Color | undefined;
    textStyle: TextStyle;
}
declare const KnobBubble: ({ translateX, scale, knobSize, valueLabelsBackgroundColor: fill, textStyle, textInputRef }: KnobProps) => JSX.Element;
export default KnobBubble;
