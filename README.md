# react-native-range-slider-expo
![Supports Android and iOS](https://img.shields.io/badge/platforms-android%20|%20ios-blue.svg) &nbsp;&nbsp;
![MIT License](https://img.shields.io/npm/l/react-native-range-slider-expo?color=red)
### Customizable range slider for react native apps <br/><br/>

\* **NEW** \* <br/>
You can now use also single slider (with one knob)<br/>and keep your project styling consistant
<br/><br/>
[Please let me know if you encounter any issues or if you have any imporvements suggestion, comments, etc..](https://github.com/D10S60948/react-native-range-slider-expo/issues)

<br/><br/>
## Getting started
`npm i react-native-range-slider-expo`

<br/><br/>
## Usage
#### Examples - images

<div style="display:flex;flex-direction:row">
  <img src="https://res.cloudinary.com/dexts7jfo/image/upload/v1595960302/image2_eqbpiw.png" style="height:100%;width:100%"/>
  <img src="https://res.cloudinary.com/dexts7jfo/image/upload/v1595960364/image_daoab0.png" style="height:100%;width:100%"/>
</div>

#### Examples - code (reflects the left image)

```javascript
import RangeSlider, { Slider } from 'react-native-range-slider-expo';
```
```javascript
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);
  const [value, setValue] = useState(0);
  const valueOnChange = (value: number) => setValue(value);
  const toValueOnChange = (value: number) => setToValue(value);
  const fromValueOnChange = (value: number) => setFromValue(value);
  
  return (
        <View style={{ flex: 1, padding: 30, justifyContent: 'space-evenly' }}>
            <View>
                <RangeSlider
                    fromValueOnChange={fromValueOnChange}
                    toValueOnChange={toValueOnChange}
                    min={0}
                    max={100}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>fromValue: {fromValue}</Text>
                    <Text>toValue: {toValue}</Text>
                </View>
            </View>
            <View>
                <RangeSlider
                    fromValueOnChange={value => console.log(value)}
                    toValueOnChange={value => console.log(value)}
                    min={20}
                    max={40}
                    step={5}
                    fromKnobColor='red'
                    toKnobColor='green'
                    styleSize='small'
                    showRangeLabels={false}
                />
            </View>
            <View>
                <Slider
                    valueOnChange={value => console.log(value)}
                    min={0}
                    max={30}
                />
            </View>
            <View>
                <Slider
                    valueOnChange={valueOnChange}
                    min={0}
                    max={30}
                    inRangeBarColor='red'
                    outOfRangeBarColor='brown'
                    styleSize='large'
                    rangeLabelsTextColor='blue'
                    knobColor='black'
                />
                <Text>value: {value}</Text>
            </View>
        </View>
    );
```

<br/>

## API - RangeSlider (default import)
| Property | Type | Required | Default |
| :---     |:----:|  :-----: | :-----: | 
| min | number | yes | - |
| max | number | yes | - |
| fromValueOnChange | callback | yes | - |
| toValueOnChange | callback | yes | - |
| step | number | no | 1 |
| styleSize | string ( 'small' \| 'medium' \| 'large' )  | no | 'medium' |
| fromKnobColor | string (color) | no | '#00a2ff' |
| toKnobColor | string (color) | no | '#00a2ff' |
| inRangeBarColor | string (color) | no | 'rgb(100,100,100)' |
| outOfRangeBarColor | string (color) | no | 'rgb(200,200,200)' |
| valueLabelsTextColor | string (color) | no | 'white' |
| valueLabelsBackgroundColor | string (color) | no | '#3a4766' |
| rangeLabelsTextColor | string (color) | no | 'rgb(60,60,60)' |
| showRangeLabels | boolean | no | true |
| showValueLabels | boolean | no | true |

## API - Slider (1 knob)
| Property | Type | Required | Default |
| :---     |:----:|  :-----: | :-----: | 
| min | number | yes | - |
| max | number | yes | - |
| valueOnChange | callback | yes | - |
| step | number | no | 1 |
| styleSize | string ( 'small' \| 'medium' \| 'large' )  | no | 'medium' |
| knobColor | string (color) | no | '#00a2ff' |
| inRangeBarColor | string (color) | no | 'rgb(200,200,200)' |
| outOfRangeBarColor | string (color) | no | 'rgb(100,100,100)' |
| valueLabelsTextColor | string (color) | no | 'white' |
| valueLabelsBackgroundColor | string (color) | no | '#3a4766' |
| rangeLabelsTextColor | string (color) | no | 'rgb(60,60,60)' |
| showRangeLabels | boolean | no | true |
| showValueLabels | boolean | no | true |
<br/><br/>

## License
This project is licensed under the MIT License

<br/><br/>

## Todo
   - [X] Add plain slider (with 1 knob)
   - [ ] Add textual values
   - [ ] Add prefix/suffix to numeric values
   - [ ] Beautify styling
   <!-- - [ ] Knob is pressed indication -->
   <!-- - [ ] Change value press on bar (on the out of range parts) -->
