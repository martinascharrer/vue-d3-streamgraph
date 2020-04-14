import { getOrdinalScale } from "./scales";

export function getColorArrayByInterpolation(keys, interpolation) {
    let colors = [];
    for (let i = 0; i <= keys.length; i++) {
        colors.push(interpolation(i / keys.length));
    }
    return colors;
}

export function color(colorArray, colorInterpolation, keys) {
    let colors = colorArray ? colorArray : getColorArrayByInterpolation(keys, colorInterpolation);
    return getOrdinalScale(keys, colors);
}

