import React, { useState, useEffect, memo, useMemo } from 'react';
import { Animated, StyleSheet, View, LayoutChangeEvent, Text, TextInput, ViewStyle, TextStyle } from 'react-native';
import { gestureHandlerRootHOC, GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import KnobBubble from './components/KnobBubble';
import useUtils, { osRtl } from './components/utils';

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
  knobBubbleTextStyle?: TextStyle,
  valueLabelsBackgroundColor?: string,
  rangeLabelsTextColor?: string,
  showRangeLabels?: boolean,
  showValueLabels?: boolean,
  initialFromValue?: number,
  initialToValue?: number,
  knobSize?: number,
  containerStyle?: ViewStyle,
  barHeight?: number,
  labelFormatter?: (value: number) => string,
}

const RangeSlider = memo(({
  min, max, fromValueOnChange, toValueOnChange,
  step = 1,
  styleSize = 'medium',
  fromKnobColor = '#00a2ff',
  toKnobColor = '#00a2ff',
  inRangeBarColor = 'rgb(100,100,100)',
  outOfRangeBarColor = 'rgb(200,200,200)',
  valueLabelsBackgroundColor = '#3a4766',
  rangeLabelsTextColor = 'rgb(60,60,60)',
  showRangeLabels = true,
  showValueLabels = true,
  initialFromValue,
  initialToValue,
  knobSize: _knobSize,
  knobBubbleTextStyle = {},
  containerStyle: customContainerStyle = {},
  barHeight: customBarHeight,
  labelFormatter,
}: SliderProps) => {
  
  // settings
  const [wasInitialized, setWasInitialized] = useState(false);
  const [knobSize, setknobSize] = useState(0);
  const [barHeight, setBarHeight] = useState(0);
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
  const {formatLabel, decimalRound} = useUtils({step, labelFormatter});

  // initalizing settings
  useEffect(() => {
    setFlexDirection(osRtl ? 'row-reverse' : 'row');
  }, [knobSize]);
  
  useEffect(() => {
    if (wasInitialized) {
      const stepSize = setStepSize(max, min, step);
      fromValueTextRef.current?.setNativeProps({ text: formatLabel(min) });
      toValueTextRef.current?.setNativeProps({ text: formatLabel(min) });
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
    const sizeBasedOnStyleSize = typeof styleSize === 'number' ? styleSize : styleSize === 'small' ? SMALL_SIZE : styleSize === 'medium' ? MEDIUM_SIZE : LARGE_SIZE;
    const size = _knobSize ?? sizeBasedOnStyleSize;
    setknobSize(customBarHeight ? Math.max(customBarHeight, size) : size);
    setBarHeight(customBarHeight ?? sizeBasedOnStyleSize / 3)
    translateXfromValue.setValue(-size / 4);
  }, [styleSize, customBarHeight]);
  
  // initalizing settings helpers
  const setFromValueStatic = (newOffset: number, knobSize: number, stepInPixels: number) => {
    newOffset = Math.floor((newOffset + (knobSize / 2)) / stepInPixels) * stepInPixels - (knobSize / 2);
    setFromValue(newOffset);
    setFromValueOffset(newOffset);
    const changeTo = Math.floor(((newOffset + (knobSize / 2)) * (max - min) / sliderWidth) / step) * step + min;
    fromValueOnChange(decimalRound(changeTo));
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
    toValueOnChange(decimalRound(changeTo));
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
      const text = formatLabel(numericValue);
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
      toValueOnChange(decimalRound(changeTo));
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

  const padding = useMemo(() => styleSize === 'large' ? 17 : styleSize === 'medium' ? 24 : 31, [styleSize]);

  return (
    <GestureHandlerRootView>
      <Animated.View style={[styles.container, { opacity, padding }, customContainerStyle]}>
        {
          showValueLabels &&
          <View style={{ width: '100%', height: 1, flexDirection }}>
            <KnobBubble {...{ knobSize, valueLabelsBackgroundColor }}
              translateX={translateXfromValue}
              scale={fromValueScale}
              textInputRef={fromValueTextRef}
              textStyle={knobBubbleTextStyle}
            />
            <KnobBubble {...{ knobSize, valueLabelsBackgroundColor }}
              translateX={translateXtoValue}
              scale={toValueScale}
              textInputRef={toValueTextRef}
              textStyle={knobBubbleTextStyle}
            />
          </View>
        }
        <View style={{ width: '100%', height: knobSize, marginVertical: 4, position: 'relative', flexDirection, alignItems: 'center' }}>
          <View style={{ position: 'absolute', backgroundColor: inRangeBarColor, left: knobSize / 4, marginLeft: -knobSize / 4, right: knobSize / 4, height: barHeight }} onLayout={onLayout} />
          <Animated.View style={{ position: 'absolute', left: knobSize / 4, marginLeft: -knobSize / 4, right: knobSize / 4, height: barHeight, backgroundColor: outOfRangeBarColor, transform: [{ translateX: sliderWidth / 2 }, { scaleX: rightBarScaleX }, { translateX: -sliderWidth / 2 }] }} />
          <Animated.View style={{ position: 'absolute', left: -knobSize / 4, width: knobSize / 2, height: barHeight, borderRadius: barHeight, backgroundColor: outOfRangeBarColor }} />
          <Animated.View style={{ width: sliderWidth, height: barHeight, backgroundColor: outOfRangeBarColor, transform: [{ translateX: -sliderWidth / 2 }, { scaleX: leftBarScaleX }, { translateX: sliderWidth / 2 }] }} />
          <Animated.View style={{ position: 'absolute', left: sliderWidth - knobSize / 4, width: knobSize / 2, height: barHeight, borderRadius: barHeight, backgroundColor: outOfRangeBarColor }} />
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
    </GestureHandlerRootView>
  );
})

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

export default gestureHandlerRootHOC(RangeSlider);
