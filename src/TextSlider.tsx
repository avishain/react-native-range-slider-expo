import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, View, LayoutChangeEvent, Text, TextInput, I18nManager, TextStyle, StyleProp } from 'react-native';
import { gestureHandlerRootHOC, GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';

const osRtl = I18nManager.isRTL;

const SMALL_SIZE = 24;
const MEDIUM_SIZE = 34;
const LARGE_SIZE = 44;
const step = 1;
const min = 0;

export type itemType = {
    value: number,
    text: string
}

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

const TextualSlider = gestureHandlerRootHOC(({
    values, valueOnChange,
    styleSize = 'medium',
    knobColor = '#00a2ff',
    inRangeBarColor = 'rgb(200,200,200)',
    outOfRangeBarColor = 'rgb(100,100,100)',
    valueLabelsTextColor = 'white',
    valueLabelsBackgroundColor = '#3a4766',
    rangeLabelsStyle,
    showRangeLabels = true,
    showValueLabels = true,
    initialValue
}: TextualSliderProps) => {

    // settings
    const [stepInPixels, setStepInPixels] = useState(0);
    const [knobSize, setknobSize] = useState(0);

    const [max, setMax] = useState(1);

    // rtl settings
    const [flexDirection, setFlexDirection] = useState<"row" | "row-reverse" | "column" | "column-reverse" | undefined>('row');
    const [svgOffset, setSvgOffset] = useState<object>({ left: (knobSize - 40) / 2 });

    const [valueOffset, setValueOffset] = useState(0);
    const [TextualSliderWidth, setTextualSliderWidth] = useState(0);

    // animation values
    const [translateX] = useState(new Animated.Value(0));
    const [valueLabelScale] = useState(new Animated.Value(0.01));
    const [inRangeScaleX] = useState(new Animated.Value(0.01));

    // refs
    const valueTextRef = React.createRef<TextInput>();
    const opacity = React.useRef<Animated.Value>(new Animated.Value(0)).current;

    // initalizing settings
    useEffect(() => {
        setMax(values.length - 1);
        setFlexDirection(osRtl ? 'row-reverse' : 'row');
        setSvgOffset(osRtl ? { right: (knobSize - 40) / 2 } : { left: (knobSize - 40) / 2 });
    }, []);
    useEffect(() => {
        if (TextualSliderWidth > 0) {
            const stepSize = setStepSize(max, min, step);
            valueTextRef.current?.setNativeProps({ text: values[min].text });
            if (typeof initialValue === 'number' && initialValue >= min && initialValue <= max) {
                const offset = ((initialValue - min) / step) * stepSize - (knobSize / 2);
                setValueStatic(offset, knobSize, stepSize);
                setValueText(offset);
            }
            Animated.timing(opacity, {
                toValue: 1,
                duration: 64,
                useNativeDriver: true
            }).start();
        }
    }, [min, max, step, initialValue, TextualSliderWidth]);
    useEffect(() => {
        const size = typeof styleSize === 'number' ? styleSize : styleSize === 'small' ? SMALL_SIZE : styleSize === 'medium' ? MEDIUM_SIZE : LARGE_SIZE;
        setknobSize(size);
        translateX.setValue(-size / 4);
    }, [styleSize]);

    const setValueStatic = (newOffset: number, knobSize: number, stepInPixels: number) => {
        newOffset = Math.round((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
        settingValue(newOffset);
        setValueOffset(newOffset);
        const index = Math.round(((newOffset + (knobSize / 2)) * (max - min) / TextualSliderWidth) / step) * step + min;
        valueOnChange(values[index]);
    }
    const settingValue = (newOffset: number) => {
        translateX.setValue(newOffset);
        inRangeScaleX.setValue((newOffset + (knobSize / 2)) / TextualSliderWidth + 0.01);
    }
    const setValueText = (totalOffset: number) => {
        const numericValue: number = Math.floor(((totalOffset + (knobSize / 2)) * (max - min) / TextualSliderWidth) / step) * step + min;
        valueTextRef.current?.setNativeProps({ text: values[numericValue].text });
    }
    const setStepSize = (max: number, min: number, step: number) => {
        const numberOfSteps = ((max - min) / step);
        const stepSize = TextualSliderWidth / numberOfSteps;
        setStepInPixels(stepSize);
        return stepSize;
    }

    // value gesture events ------------------------------------------------------------------------
    const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
        let totalOffset = event.nativeEvent.translationX + valueOffset;
        if (totalOffset >= - knobSize / 2 && totalOffset <= TextualSliderWidth - knobSize / 2) {
            translateX.setValue(totalOffset);
            if (valueTextRef != null) {
                const index = Math.round(((totalOffset + (knobSize / 2)) * (max - min) / TextualSliderWidth) / step) * step + min;
                valueTextRef.current?.setNativeProps({ text: values[index].text });
            }
            inRangeScaleX.setValue((totalOffset + (knobSize / 2)) / TextualSliderWidth + 0.01);
        }
    }
    const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.BEGAN) {
            scaleTo(valueLabelScale, 1);
        }
        if (event.nativeEvent.state === State.END) {
            let newOffset = event.nativeEvent.translationX + valueOffset;
            newOffset = Math.round((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
            if (newOffset < -knobSize / 2) {
                newOffset = -knobSize / 2;
            } else if (newOffset >= TextualSliderWidth - knobSize / 2) {
                newOffset = TextualSliderWidth - knobSize / 2;
            }
            setValueStatic(newOffset, knobSize, stepInPixels);
            scaleTo(valueLabelScale, 0.01);
        }
    }
    // ------------------------------------------------------------------------------------------------

    // gesture events help functions ------------------------------------------------------------------
    const scaleTo = (param: Animated.Value, toValue: number) => Animated.timing(param,
        {
            toValue,
            duration: 150,
            useNativeDriver: true
        }
    ).start();
    // ------------------------------------------------------------------------------------------------

    // setting bar width ------------------------------------------------------------------------------
    const onLayout = (event: LayoutChangeEvent) => {
        setTextualSliderWidth(event.nativeEvent.layout.width);
    }
    // ------------------------------------------------------------------------------------------------

    const labelOpacity = valueLabelScale.interpolate({
        inputRange: [0.1, 1],
        outputRange: [0, 1]
    })
    return (
    <GestureHandlerRootView>
        <Animated.View style={[styles.container, { opacity, padding: styleSize === 'large' ? 7 : styleSize === 'medium' ? 14 : 21 }]}>
            {
                showValueLabels &&
                <View style={{ width: '100%', flexDirection }}>
                    <Animated.View
                        style={{ position: 'absolute', bottom: 0, left: 0, opacity: labelOpacity, transform: [{ translateX }, { scale: valueLabelScale }] }}
                    >
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <TextInput style={{ ...svgOffset, color: valueLabelsTextColor, fontWeight: 'bold', backgroundColor: valueLabelsBackgroundColor, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 3 }} ref={valueTextRef} />
                        </View>
                    </Animated.View>
                </View>
            }
            <View style={{ width: '100%', height: knobSize, marginVertical: 4, position: 'relative', flexDirection, alignItems: 'center' }}>
                <View style={[styles.bar, { backgroundColor: inRangeBarColor, left: knobSize / 4, marginLeft: -knobSize / 4, right: knobSize / 4, height: knobSize / 3 }]} onLayout={onLayout} />
                <Animated.View style={{ width: TextualSliderWidth, height: knobSize / 3, backgroundColor: outOfRangeBarColor, transform: [{ translateX: -TextualSliderWidth / 2 }, { scaleX: inRangeScaleX }, { translateX: TextualSliderWidth / 2 }] }} />
                <Animated.View style={{ position: 'absolute', left: -knobSize / 4, width: knobSize / 2.5, height: knobSize / 3, borderRadius: knobSize / 3, backgroundColor: outOfRangeBarColor }} />
                <PanGestureHandler {...{ onGestureEvent, onHandlerStateChange }}>
                    <Animated.View style={[styles.knob, { height: knobSize, width: knobSize, borderRadius: knobSize, backgroundColor: knobColor, transform: [{ translateX }] }]} />
                </PanGestureHandler>
            </View>
            {
                showRangeLabels &&
                <View style={{ width: '100%', flexDirection, justifyContent: 'space-between' }}>
                    <Text style={[rangeLabelsStyle, { fontWeight: "bold", marginLeft: -7 }]}>{values.length > 1 ? values[0].text : ''}</Text>
                    <Text style={[rangeLabelsStyle, { fontWeight: "bold" }]}>{values.length > 1 ? values[max].text : ''}</Text>
                </View>
            }
        </Animated.View>
    </GestureHandlerRootView>
    );
});

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: '100%',
        overflow: 'visible'
    },
    knob: {
        position: 'absolute',
        elevation: 4
    },
    bar: {
        position: 'absolute',
        borderBottomRightRadius: 100,
        borderTopRightRadius: 100
    }
});

export default TextualSlider;
