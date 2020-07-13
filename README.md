# react-native-range-slider-expo
#### Customizable range slider for react native apps

<br/><br/>
## Getting started
`npm i react-native-range-slider-expo`

<br/><br/>
## Usage
#### Example
<div>
  <img src="./image.png" style="height:100%;width:100%"/>
</div>

```javascript
  import Slider from 'react-native-range-slider-expo';
```
```javascript
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);
  const fromValueOnChange = value => setFromValue(value);
  const toValueOnChange = value => setToValue(value);
  return (
      <View style={{ flex: 1, padding: 50, justifyContent: 'space-evenly' }}>
          <Slider 
              fromValueOnChange={fromValueOnChange} 
              toValueOnChange={toValueOnChange}
              min={0}
              max={100}
              step={5}
          />
          <Slider  
              fromValueOnChange={fromValueOnChange} 
              toValueOnChange={toValueOnChange}
              min={20}
              max={200}
              step={20}
              styleSize='small'
              fromKnobColor='red'
              toKnobColor='green'
              valueLabelsBackgroundColor='rgb(10,10,10)'
              valueLabelsTextColor='white'
              rangeLabelsTextColor='blue'
              inRangeBarColor='grey'
              outOfRangeBarColor='rgb(200,200,200)'
          />
          <Slider  
              fromValueOnChange={fromValueOnChange} 
              toValueOnChange={toValueOnChange}
              min={0}
              max={10}
              styleSize='large'
              fromKnobColor='black'
              toKnobColor='black'
              valueLabelsBackgroundColor='rgb(0,80,100)'
              showRangeLabels={false}
              showValueLabels={false}
          />
      </View>
```

<br/>

## API
| Property | Type | Required | Default |
| :---     |:----:|  :-----: | :-----: | 
| min | boolean | yes | - |
| max | boolean | yes | - |
| fromValueOnChange | callback | yes | - |
| toValueOnChange | callback | yes | - |
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

<br/><br/>

## License
This project is licensed under the MIT License

<br/><br/>

## Todo
   - [ ] Change value press on bar (on the out of range parts)
   - [ ] Knob is pressed indication
   - [ ] Textual values
   - [ ] contant selected values appearance
   - [ ] Beautify styling
