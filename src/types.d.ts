export interface SliderProps {
    min: number;
    max: number;
    fromValueOnChange: (value: number) => void;
    toValueOnChange: (value: number) => void;
    step?: number;
    styleSize?: 'small' | 'medium' | 'large';
    fromKnobColor?: string;
    toKnobColor?: string;
    inRangeBarColor?: string;
    outOfRangeBarColor?: string;
    valueLabelsTextColor?: string;
    valueLabelsBackgroundColor?: string;
    rangeLabelsTextColor?: string;
    showRangeLabels?: boolean;
    showValueLabels?: boolean;
}
