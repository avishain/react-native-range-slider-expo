import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, View, LayoutChangeEvent, Text, TextInput, I18nManager } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import KnobBubble from './components/KnobBubble';
import { countDecimals, osRtl } from './components/utils';

const SMALL_SIZE = 24;
const MEDIUM_SIZE = 34;
const LARGE_SIZE = 44;
const fontSize = 15;

interface SliderProps {
  min: number,
  max: number,
  fromValueOnChange: (value: number) => void,
  toValueOnChange: (value: number) => void,
  step?: number,
  styleSize?: 'small' | 'medium' | 'large' | number,
  fromKnobColor?: string,
  toKnobColor?: string,
  inRangeBarColor?: string,
  outOfRangeBarColor?: string,
  valueLabelsTextColor?: string,
  valueLabelsBackgroundColor?: string,
  rangeLabelsTextColor?: string,
  showRangeLabels?: boolean,
  showValueLabels?: boolean,
  initialFromValue?: number,
  initialToValue?: number
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
  showValueLabels = true,
  initialFromValue,
  initialToValue
}: SliderProps) => {

  const decimals = countDecimals(step);
  const toDecimal = (num: number) => {
    const m = 10 ** decimals;
    return Math.round(num * m) / m;
  }
  // settings
  const [wasInitialized, setWasInitialized] = useState(false);
  const [knobSize, setknobSize] = useState(0);
  const [stepInPixels, setStepInPixels] = useState(0);

  // rtl settings
  const [flexDirection, setFlexDirection] = useState<"row" | "row-reverse" | "column" | "column-reverse" | undefined>('row');

  const [fromValueOffset, setFromValueOffset] = useState(0);
  const [toValueOffset, setToValueOffset] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
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
  const opacity = React.useRef<Animated.Value>(new Animated.Value(0)).current;

  // initalizing settings
  useEffect(() => {
    setFlexDirection(osRtl ? 'row-reverse' : 'row');
  }, [knobSize]);
  useEffect(() => {
    if (wasInitialized) {
      const stepSize = setStepSize(max, min, step);
      fromValueTextRef.current?.setNativeProps({ text: decimals > 0 ? min.toFixed(decimals) : min.toString() });
      toValueTextRef.current?.setNativeProps({ text: decimals > 0 ? max.toFixed(decimals) : max.toString() });
      if (typeof initialFromValue === 'number' && initialFromValue >= min && initialFromValue <= max) {
        const offset = ((initialFromValue - min) / step) * stepSize - (knobSize / 2);
        setFromValueStatic(offset, knobSize, stepSize);
        setValueText(offset + knobSize, true);
      }
      if (typeof initialToValue === 'number' && initialToValue >= min && initialToValue <= max && typeof initialFromValue === 'number' && initialToValue > initialFromValue) {
        const offset = ((initialToValue - min) / step) * stepSize - (knobSize / 2);
        setToValueStatic(offset, knobSize, stepSize);
        setValueText(offset, false);
      }
      Animated.timing(opacity, {
        toValue: 1,
        duration: 64,
        useNativeDriver: true
      }).start();
    }
  }, [min, max, step, initialFromValue, initialToValue, wasInitialized]);
  useEffect(() => {
    const size = typeof styleSize === 'number' ? styleSize : styleSize === 'small' ? SMALL_SIZE : styleSize === 'medium' ? MEDIUM_SIZE : LARGE_SIZE;
    setknobSize(size);
    translateXfromValue.setValue(-size / 4);
  }, [styleSize]);

  // initalizing settings helpers
  const setFromValueStatic = (newOffset: number, knobSize: number, stepInPixels: number) => {
    newOffset = Math.floor((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
    setFromValue(newOffset);
    setFromValueOffset(newOffset);
    const changeTo = Math.floor(((newOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min;
    fromValueOnChange(toDecimal(changeTo));
  }
  const setFromValue = (newOffset: number) => {
    translateXfromValue.setValue(newOffset);
    leftBarScaleX.setValue((newOffset + (knobSize / 2)) / sliderWidth + 0.01);
  }
  const setToValueStatic = (newOffset: number, knobSize: number, stepInPixels: number) => {
    newOffset = Math.ceil((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
    setToValue(newOffset);
    setToValueOffset(newOffset);
    const changeTo = Math.ceil(((newOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min;
    toValueOnChange(toDecimal(changeTo));
  }
  const setToValue = (newOffset: number) => {
    translateXtoValue.setValue(newOffset);
    rightBarScaleX.setValue(1.01 - ((newOffset + (knobSize / 2)) / sliderWidth));
  }
  const setStepSize = (max: number, min: number, step: number) => {
    const numberOfSteps = ((max - min) / step);
    const stepSize = sliderWidth / numberOfSteps;
    setStepInPixels(stepSize);
    return stepSize;
  }
  const setValueText = (totalOffset: number, from = true) => {
    const isFrom = from && fromValueTextRef != null;
    const isTo = !from && toValueTextRef != null;
    if (isFrom || isTo) {
      const numericValue: number = Math[isFrom ? 'floor' : 'ceil'](((totalOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min;
      const text = decimals > 0 ? numericValue.toFixed(decimals) : numericValue.toString();
      (isFrom ? fromValueTextRef : toValueTextRef).current?.setNativeProps({ text });
    }
  }

  // from value gesture events ------------------------------------------------------------------------
  const onGestureEventFromValue = (event: PanGestureHandlerGestureEvent) => {
    let totalOffset = event.nativeEvent.translationX + fromValueOffset;
    if (totalOffset >= -knobSize / 2 && totalOffset < toValueOffset) {
      translateXfromValue.setValue(totalOffset);
      setValueText(totalOffset, true);
      leftBarScaleX.setValue((totalOffset + (knobSize / 2)) / sliderWidth + 0.01);
    }
  }
  const onHandlerStateChangeFromValue = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      scaleTo(fromValueScale, 1);
      setElevations(6, 5);
    }
    if (event.nativeEvent.state === State.END) {
      let newOffset = event.nativeEvent.translationX + fromValueOffset;
      newOffset = Math.floor((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
      if (newOffset < -knobSize / 2) {
        newOffset = -knobSize / 2;
      } else if (newOffset >= toValueOffset) {
        newOffset = toValueOffset - stepInPixels;
      }
      setFromValueStatic(newOffset, knobSize, stepInPixels)
      scaleTo(fromValueScale, 0.01);
    }
  }
  // ------------------------------------------------------------------------------------------------

  // to value gesture events ------------------------------------------------------------------------
  const onGestureEventToValue = (event: PanGestureHandlerGestureEvent) => {
    const totalOffset = event.nativeEvent.translationX + toValueOffset;
    if (totalOffset <= sliderWidth - knobSize / 2 && totalOffset > fromValueOffset) {
      translateXtoValue.setValue(totalOffset);
      setValueText(totalOffset, false);
      rightBarScaleX.setValue(1.01 - ((totalOffset + (knobSize / 2)) / sliderWidth));
    }
  }
  const onHandlerStateChangeToValue = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      scaleTo(toValueScale, 1);
      setElevations(5, 6);
    }
    if (event.nativeEvent.state === State.END) {
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
      const changeTo = Math.ceil(((newOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min;
      toValueOnChange(toDecimal(changeTo));
    }
  }
  // ------------------------------------------------------------------------------------------------

  // gesture events help functions ------------------------------------------------------------------
  const scaleTo = (param: Animated.Value, toValue: number) => Animated.timing(param, {
    toValue,
    duration: 150,
    useNativeDriver: true
  }).start();

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
      translateXtoValue.setValue(width - knobSize / 2);
      setToValueOffset(width - knobSize / 2);
      setWasInitialized(true);
    }
  }
  // ------------------------------------------------------------------------------------------------

  return (
    <Animated.View style={[styles.container, { opacity, padding: styleSize === 'large' ? 7 : styleSize === 'medium' ? 14 : 21 }]}>
      {
        showValueLabels &&
        <View style={{ width: '100%', height: 1, flexDirection }}>
          <KnobBubble {...{ knobSize, valueLabelsBackgroundColor, valueLabelsTextColor }}
            translateX={translateXfromValue}
            scale={fromValueScale}
            textInputRef={fromValueTextRef}
          />
          <KnobBubble {...{ knobSize, valueLabelsBackgroundColor, valueLabelsTextColor }}
            translateX={translateXtoValue}
            scale={toValueScale}
            textInputRef={toValueTextRef}
          />
        </View>
      }
      <View style={{ width: '100%', height: knobSize, marginVertical: 4, position: 'relative', flexDirection, alignItems: 'center' }}>
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
        <View style={{ width: '100%', flexDirection, justifyContent: 'space-between' }}>
          <Text style={{ color: rangeLabelsTextColor, fontWeight: "bold", fontSize }}>{min}</Text>
          <Text style={{ color: rangeLabelsTextColor, fontWeight: "bold", fontSize }}>{max}</Text>
        </View>
      }
    </Animated.View>
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
