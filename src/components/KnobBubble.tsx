import React, { useMemo } from 'react';
import { Animated, StyleSheet, TextInput, TextStyle } from 'react-native';
import Svg, { Color, Path } from 'react-native-svg';
import { osRtl } from './utils';

interface KnobProps {
  translateX: Animated.Value;
  scale: Animated.Value;
  knobSize: number;
  textInputRef: React.RefObject<TextInput>;
  valueLabelsBackgroundColor: Color | undefined;
  textStyle: TextStyle;
}

const KnobBubble = ({ translateX, scale, knobSize, valueLabelsBackgroundColor: fill, textStyle, textInputRef }: KnobProps) => {
  const d = useMemo(() => "M20.368027196163986,55.24077513402203 C20.368027196163986,55.00364778429386 37.12897994729114,42.11537830086061 39.19501224411266,22.754628132990383 C41.26104454093417,3.393877965120147 24.647119286738516,0.571820003300814 20.368027196163986,0.7019902620266703 C16.088935105589453,0.8321519518460209 -0.40167016290734386,3.5393865664909434 0.7742997013327574,21.806127302984205 C1.950269565572857,40.07286803947746 20.368027196163986,55.4779024837502 20.368027196163986,55.24077513402203 z", []);
  const stroke = fill;
  const height = 56;
  const svgOffset = useMemo(() => osRtl ? { right: (knobSize - 40) / 2 } : { left: (knobSize - 40) / 2 }, [knobSize]);
  return (
    <Animated.View
      style={[styles.container, { opacity: scale, transform: [{ translateX }, { translateY: height / 2 }, { scale }, { translateY: -height / 2 },] }]}
    >
      <Svg width={height * .74} height={height} style={[svgOffset, { justifyContent: 'center', alignItems: 'center' }]} >
        <Path {...{ d, fill, stroke }} strokeWidth={1} />
      </Svg>
      <TextInput editable={false} style={[styles.textInput, svgOffset, textStyle]} ref={textInputRef} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  textInput: {
    position: 'absolute',
    width: 40,
    textAlign: 'center',
    bottom: 25,
    fontWeight: 'bold',
    color: 'white'
  }
})

export default KnobBubble;
