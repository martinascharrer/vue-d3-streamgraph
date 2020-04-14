import { scaleOrdinal as d3ScaleOrdinal } from 'd3-scale';

export function getColorArrayByInterpolation(keys, interpolation) {
    let colors = [];
    for (let i = 0; i <= keys.length; i++) {
        colors.push(interpolation(i / keys.length));
    }
    return colors;
}

export function color(colorArray, colorInterpolation, keys) {
    let colors = colorArray ? colorArray : getColorArrayByInterpolation(keys, colorInterpolation);
    return d3ScaleOrdinal().domain(keys).range(colors);
}

