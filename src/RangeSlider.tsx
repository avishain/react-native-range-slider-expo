import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, View, LayoutChangeEvent, Text, TextInput } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

const SMALL_SIZE = 24;
const MEDIUM_SIZE = 34;
const LARGE_SIZE = 44;

interface SliderProps {
    min: number,
    max: number,
    fromValueOnChange: (value: number) => void,
    toValueOnChange: (value: number) => void,
    step?: number,
    styleSize?: 'small' | 'medium' | 'large',
    fromKnobColor?: string,
    toKnobColor?: string,
    inRangeBarColor?: string,
    outOfRangeBarColor?: string,
    valueLabelsTextColor?: string,
    valueLabelsBackgroundColor?: string,
    rangeLabelsTextColor?: string,
    showRangeLabels?: boolean,
    showValueLabels?: boolean
}

export default ({
    min, max, fromValueOnChange, toValueOnChange,
    step = 1,
    styleSize = 'medium',
    fromKnobColor = '#00a2ff',
    toKnobColor = '#00a2ff',
    inRangeBarColor = 'rgb(100,100,100)',
    outOfRangeBarColor = 'rgb(200,200,200)',
    valueLabelsTextColor = 'white',
    valueLabelsBackgroundColor = '#3a4766',
    rangeLabelsTextColor = 'rgb(60,60,60)',
    showRangeLabels = true,
    showValueLabels = true
}: SliderProps) => {

    // settings
    const [wasInitialized, setWasInitialized] = useState(false);
    const [numberOfSteps, setNumberOfSteps] = useState(0);
    const [knobSize, setknobSize] = useState(0);
    const [fontSize, setFontSize] = useState(15);

    const [fromValueOffset, setFromValueOffset] = useState(0);
    const [toValueOffset, setToValueOffset] = useState(0);
    const [sliderWidth, setSliderWidth] = useState(0);
    const [xStart, setXStart] = useState(0);
    const [fromElevation, setFromElevation] = useState(3);
    const [toElevation, setToElevation] = useState(3);

    // animation values
    const [translateXfromValue] = useState(new Animated.Value(0));
    const [translateXtoValue] = useState(new Animated.Value(0));
    const [fromValueScale] = useState(new Animated.Value(0.01));
    const [toValueScale] = useState(new Animated.Value(0.01));
    const [rightBarScaleX] = useState(new Animated.Value(0.01));
    const [leftBarScaleX] = useState(new Animated.Value(0.01));

    // refs
    const toValueTextRef = React.createRef<TextInput>();
    const fromValueTextRef = React.createRef<TextInput>();

    // initalizing settings
    useEffect(() => {
        setNumberOfSteps((max - min) / step);
        fromValueTextRef.current?.setNativeProps({ text: min.toString() });
        toValueTextRef.current?.setNativeProps({ text: max.toString() });
    }, [min, max, step]);
    useEffect(() => {
        const size = styleSize === 'small' ? SMALL_SIZE : styleSize === 'medium' ? MEDIUM_SIZE : LARGE_SIZE;
        setknobSize(size);
        translateXfromValue.setValue(-size / 4);
    }, [styleSize]);

    // from value gesture events ------------------------------------------------------------------------
    const onGestureEventFromValue = (event: PanGestureHandlerGestureEvent) => {
        let totalOffset = event.nativeEvent.translationX + fromValueOffset;
        if (totalOffset >= xStart - knobSize / 2 && totalOffset < toValueOffset) {
            translateXfromValue.setValue(totalOffset);
            if (fromValueTextRef != null) {
                fromValueTextRef.current?.setNativeProps({ text: (Math.floor(((totalOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min).toString() });
            }
            leftBarScaleX.setValue((totalOffset + (knobSize / 2)) / sliderWidth + 0.01);
        }
    }
    const onHandlerStateChangeFromValue = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.BEGAN) {
            scaleTo(fromValueScale, 1);
            setElevations(6, 5);
        }
        if (event.nativeEvent.state === State.END) {
            const stepInPixels = sliderWidth / numberOfSteps;
            let newOffset = event.nativeEvent.translationX + fromValueOffset;
            newOffset = Math.floor((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
            if (newOffset < xStart - knobSize / 2) {
                newOffset = xStart - knobSize / 2;
            } else if (newOffset >= toValueOffset) {
                newOffset = toValueOffset - stepInPixels;
            }
            setFromValueOffset(newOffset);
            translateXfromValue.setValue(newOffset);
            leftBarScaleX.setValue((newOffset + (knobSize / 2)) / sliderWidth + 0.01);
            scaleTo(fromValueScale, 0.01);
            fromValueOnChange(Math.floor(((newOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min);
        }
    }
    // ------------------------------------------------------------------------------------------------

    // to value gesture events ------------------------------------------------------------------------
    const onGestureEventToValue = (event: PanGestureHandlerGestureEvent) => {
        const totalOffset = event.nativeEvent.translationX + toValueOffset;
        if (totalOffset <= sliderWidth - knobSize / 2 && totalOffset > fromValueOffset) {
            translateXtoValue.setValue(totalOffset);
            if (toValueTextRef != null) {
                const numericValue: number = Math.ceil(((totalOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min;
                toValueTextRef.current?.setNativeProps({ text: numericValue.toString() });
            }
            rightBarScaleX.setValue(1.01 - ((totalOffset + (knobSize / 2)) / sliderWidth));
        }
    }
    const onHandlerStateChangeToValue = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.BEGAN) {
            scaleTo(toValueScale, 1);
            setElevations(5, 6);
        }
        if (event.nativeEvent.state === State.END) {
            const stepInPixels = sliderWidth / numberOfSteps;
            let newOffset = event.nativeEvent.translationX + toValueOffset;
            newOffset = Math.ceil((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
            if (newOffset > sliderWidth - knobSize / 2) {
                newOffset = sliderWidth - knobSize / 2;
            } else if (newOffset <= fromValueOffset) {
                newOffset = fromValueOffset + stepInPixels;
            }
            setToValueOffset(newOffset);
            translateXtoValue.setValue(newOffset);
            rightBarScaleX.setValue(1.01 - ((newOffset + (knobSize / 2)) / sliderWidth));
            scaleTo(toValueScale, 0.01);
            toValueOnChange(Math.ceil(((newOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min);
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

    const setElevations = (fromValue: number, toValue: number) => {
        setFromElevation(fromValue);
        setToElevation(toValue)
    }
    // ------------------------------------------------------------------------------------------------

    // setting bar width ------------------------------------------------------------------------------
    const onLayout = (event: LayoutChangeEvent) => {
        if (wasInitialized === false) {
            const { width } = event.nativeEvent.layout;
            setSliderWidth(width);
            setXStart(0);
            translateXtoValue.setValue(width - knobSize / 2);
            setToValueOffset(width - knobSize / 2);
            setWasInitialized(true);
        }
    }
    // ------------------------------------------------------------------------------------------------

    return (
        <View style={[styles.container, { padding: styleSize === 'large' ? 7 : styleSize === 'medium' ? 14 : 21 }]}>
            {
                showValueLabels &&
                <View style={{ width: '100%' }}>
                    <Animated.View
                        style={{ position: 'absolute', bottom: 0, transform: [{ translateX: translateXfromValue }, { scale: fromValueScale }] }}
                    >
                        <Svg width={40} height={56} style={{ left: (knobSize - 40) / 2, justifyContent: 'center', alignItems: 'center' }} >
                            <Path
                                d="M20.368027196163986,55.24077513402203 C20.368027196163986,55.00364778429386 37.12897994729114,42.11537830086061 39.19501224411266,22.754628132990383 C41.26104454093417,3.393877965120147 24.647119286738516,0.571820003300814 20.368027196163986,0.7019902620266703 C16.088935105589453,0.8321519518460209 -0.40167016290734386,3.5393865664909434 0.7742997013327574,21.806127302984205 C1.950269565572857,40.07286803947746 20.368027196163986,55.4779024837502 20.368027196163986,55.24077513402203 z"
                                strokeWidth={1}
                                fill={valueLabelsBackgroundColor}
                                stroke={valueLabelsBackgroundColor}
                            />
                        </Svg>
                        <TextInput editable={false}  style={{ position: 'absolute', width: 40, textAlign: 'center', left: (knobSize - 40) / 2, color: valueLabelsTextColor, bottom: 25, fontWeight: 'bold' }} ref={fromValueTextRef} />
                    </Animated.View>
                    <Animated.View
                        style={{ position: 'absolute', bottom: 0, alignItems: 'center', transform: [{ translateX: translateXtoValue }, { scale: toValueScale }] }}
                    >
                        <Svg width={40} height={56} style={{ left: (knobSize - 40) / 2, justifyContent: 'center', alignItems: 'center' }} >
                            <Path
                                d="M20.368027196163986,55.24077513402203 C20.368027196163986,55.00364778429386 37.12897994729114,42.11537830086061 39.19501224411266,22.754628132990383 C41.26104454093417,3.393877965120147 24.647119286738516,0.571820003300814 20.368027196163986,0.7019902620266703 C16.088935105589453,0.8321519518460209 -0.40167016290734386,3.5393865664909434 0.7742997013327574,21.806127302984205 C1.950269565572857,40.07286803947746 20.368027196163986,55.4779024837502 20.368027196163986,55.24077513402203 z"
                                strokeWidth={1}
                                fill={valueLabelsBackgroundColor}
                                stroke={valueLabelsBackgroundColor}
                            />
                        </Svg>
                        <TextInput editable={false} style={{ position: 'absolute', width: 40, textAlign: 'center', left: (knobSize - 40) / 2, color: valueLabelsTextColor, bottom: 25, fontWeight: 'bold' }} ref={toValueTextRef} />
                    </Animated.View>
                </View>
            }
            <View style={{ width: '100%', height: knobSize, marginVertical: 4, position: 'relative', flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ position: 'absolute', backgroundColor: inRangeBarColor, left: knobSize / 4, marginLeft: -knobSize / 4, right: knobSize / 4, height: knobSize / 3 }} onLayout={onLayout} />
                <Animated.View style={{ position: 'absolute', left: knobSize / 4, marginLeft: -knobSize / 4, right: knobSize / 4, height: knobSize / 3, backgroundColor: outOfRangeBarColor, transform: [{ translateX: sliderWidth / 2 }, { scaleX: rightBarScaleX }, { translateX: -sliderWidth / 2 }] }} />
                <Animated.View style={{ position: 'absolute', left: -knobSize / 4, width: knobSize / 2, height: knobSize / 3, borderRadius: knobSize / 3, backgroundColor: outOfRangeBarColor }} />
                <Animated.View style={{ width: sliderWidth, height: knobSize / 3, backgroundColor: outOfRangeBarColor, transform: [{ translateX: -sliderWidth / 2 }, { scaleX: leftBarScaleX }, { translateX: sliderWidth / 2 }] }} />
                <Animated.View style={{ position: 'absolute', left: sliderWidth - knobSize / 4, width: knobSize / 2, height: knobSize / 3, borderRadius: knobSize / 3, backgroundColor: outOfRangeBarColor }} />
                <PanGestureHandler onGestureEvent={onGestureEventFromValue} onHandlerStateChange={onHandlerStateChangeFromValue}>
                    <Animated.View style={[styles.knob, { height: knobSize, width: knobSize, borderRadius: knobSize, backgroundColor: fromKnobColor, elevation: fromElevation, transform: [{ translateX: translateXfromValue }] }]} />
                </PanGestureHandler>
                <PanGestureHandler onGestureEvent={onGestureEventToValue} onHandlerStateChange={onHandlerStateChangeToValue}>
                    <Animated.View style={[styles.knob, { height: knobSize, width: knobSize, borderRadius: knobSize, backgroundColor: toKnobColor, elevation: toElevation, transform: [{ translateX: translateXtoValue }] }]} />
                </PanGestureHandler>
            </View>
            {
                showRangeLabels &&
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: rangeLabelsTextColor, fontWeight: "bold", fontSize }}>{min}</Text>
                    <Text style={{ color: rangeLabelsTextColor, fontWeight: "bold", fontSize }}>{max}</Text>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: '100%'
    },
    knob: {
        position: 'absolute',
        elevation: 4
    }
});
