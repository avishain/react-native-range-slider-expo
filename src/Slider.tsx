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
    valueOnChange: (value: number) => void,
    step?: number,
    styleSize?: 'small' | 'medium' | 'large',
    knobColor?: string,
    inRangeBarColor?: string,
    outOfRangeBarColor?: string,
    valueLabelsTextColor?: string,
    valueLabelsBackgroundColor?: string,
    rangeLabelsTextColor?: string,
    showRangeLabels?: boolean,
    showValueLabels?: boolean
}

export const Slider = ({
    min, max, valueOnChange,
    step = 1,
    styleSize = 'medium',
    knobColor = '#00a2ff',
    inRangeBarColor = 'rgb(200,200,200)',
    outOfRangeBarColor = 'rgb(100,100,100)',
    valueLabelsTextColor = 'white',
    valueLabelsBackgroundColor = '#3a4766',
    rangeLabelsTextColor = 'rgb(60,60,60)',
    showRangeLabels = true,
    showValueLabels = true
}: SliderProps) => {

    // settings
    const [numberOfSteps, setNumberOfSteps] = useState(0);
    const [knobSize, setknobSize] = useState(0);
    const [fontSize] = useState(15);

    const [valueOffset, setValueOffset] = useState(0);
    const [sliderWidth, setSliderWidth] = useState(0);

    // animation values
    const [translateX] = useState(new Animated.Value(0));
    const [valueLabelScale] = useState(new Animated.Value(0.01));
    const [inRangeScaleX] = useState(new Animated.Value(0.01));

    // refs
    const valueTextRef = React.createRef<TextInput>();

    // initalizing settings
    useEffect(() => {
        setNumberOfSteps((max - min) / step);
        valueTextRef.current?.setNativeProps({ text: min.toString() });
    }, [min, max, step]);
    useEffect(() => {
        const size = styleSize === 'small' ? SMALL_SIZE : styleSize === 'medium' ? MEDIUM_SIZE : LARGE_SIZE;
        setknobSize(size);
        translateX.setValue(-size / 4);
    }, [styleSize]);

    // value gesture events ------------------------------------------------------------------------
    const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
        let totalOffset = event.nativeEvent.translationX + valueOffset;
        if (totalOffset >= - knobSize / 2 && totalOffset <= sliderWidth - knobSize/2) {
            translateX.setValue(totalOffset);
            if (valueTextRef != null) {
                valueTextRef.current?.setNativeProps({ text: (Math.round(((totalOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min).toString() });
            }
            inRangeScaleX.setValue((totalOffset + (knobSize / 2)) / sliderWidth + 0.01);
        }
    }
    const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
        if (event.nativeEvent.state === State.BEGAN) {
            scaleTo(valueLabelScale, 1);
        }
        if (event.nativeEvent.state === State.END) {
            const stepInPixels = sliderWidth / numberOfSteps;
            let newOffset = event.nativeEvent.translationX + valueOffset;
            newOffset = Math.round((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
            if (newOffset <  -knobSize / 2) {
                newOffset =  -knobSize / 2;
            } else if (newOffset >= sliderWidth - knobSize/2) {
                newOffset = sliderWidth- knobSize/2;
            }
            setValueOffset(newOffset);
            translateX.setValue(newOffset);
            inRangeScaleX.setValue((newOffset + (knobSize / 2)) / sliderWidth + 0.01);
            scaleTo(valueLabelScale, 0.01);
            valueOnChange(Math.round(((newOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min);
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
            setSliderWidth(event.nativeEvent.layout.width);
    }
    // ------------------------------------------------------------------------------------------------

    return (
        <View style={[styles.container, { padding: styleSize === 'large' ? 7 : styleSize === 'medium' ? 14 : 21 }]}>
            {
                showValueLabels &&
                <View style={{ width: '100%' }}>
                    <Animated.View
                        style={{ position: 'absolute', bottom: 0, transform: [{ translateX }, { scale: valueLabelScale }] }}
                    >
                        <Svg width={40} height={56} style={{ left: (knobSize - 40) / 2, justifyContent: 'center', alignItems: 'center' }} >
                            <Path
                                d="M20.368027196163986,55.24077513402203 C20.368027196163986,55.00364778429386 37.12897994729114,42.11537830086061 39.19501224411266,22.754628132990383 C41.26104454093417,3.393877965120147 24.647119286738516,0.571820003300814 20.368027196163986,0.7019902620266703 C16.088935105589453,0.8321519518460209 -0.40167016290734386,3.5393865664909434 0.7742997013327574,21.806127302984205 C1.950269565572857,40.07286803947746 20.368027196163986,55.4779024837502 20.368027196163986,55.24077513402203 z"
                                strokeWidth={1}
                                fill={valueLabelsBackgroundColor}
                                stroke={valueLabelsBackgroundColor}
                            />
                        </Svg>
                        <TextInput style={{ position: 'absolute', width: 40, textAlign: 'center', left: (knobSize - 40) / 2, color: valueLabelsTextColor, bottom: 25, fontWeight: 'bold' }} ref={valueTextRef} />
                    </Animated.View>
                </View>
            }
            <View style={{ width: '100%', height: knobSize, marginVertical: 4, position: 'relative', flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.bar, { backgroundColor: inRangeBarColor, left: knobSize / 4, marginLeft: -knobSize / 4, right: knobSize / 4, height: knobSize / 3 }]} onLayout={onLayout} />
                <Animated.View style={{ width: sliderWidth, height: knobSize / 3, backgroundColor: outOfRangeBarColor, transform: [{ translateX: -sliderWidth / 2 }, { scaleX: inRangeScaleX }, { translateX: sliderWidth / 2 }] }} />
                <Animated.View style={{ position: 'absolute', left: -knobSize / 4, width: knobSize / 2.5, height: knobSize / 3, borderRadius: knobSize / 3, backgroundColor: outOfRangeBarColor }} />
                <PanGestureHandler {...{ onGestureEvent, onHandlerStateChange }}>
                    <Animated.View style={[styles.knob, { height: knobSize, width: knobSize, borderRadius: knobSize, backgroundColor: knobColor, transform: [{ translateX }] }]} />
                </PanGestureHandler>
            </View>
            {
                showRangeLabels &&
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: rangeLabelsTextColor, fontWeight: "bold", fontSize, marginLeft: -7 }}>{min}</Text>
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
    },
    bar: {
        position: 'absolute',
        borderBottomRightRadius: 100,
        borderTopRightRadius: 100
    }
});
