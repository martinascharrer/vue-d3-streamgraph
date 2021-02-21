import {
    scaleLinear as d3ScaleLinear,
    scaleOrdinal as d3ScaleOrdinal,
} from 'd3-scale';

export function getLinearScale(domain, range) {
    return d3ScaleLinear()
        .domain(domain)
        .range(range);
}

export function getOrdinalScale(domain, range) {
    return d3ScaleOrdinal()
        .domain(domain)
        .range(range);
}