export function showNSignificantDigits(number, n) {
    // Handle invalid input (non-numeric or negative n)
    if (isNaN(number)) {
        return NaN;
    }

    // Convert to a string for easier manipulation
    const numString = String(number);

    // Handle trailing zeros (special case for numbers ending in ".0", ".00", etc.)
    if (/\.0+$/.test(numString)) {
        const significantDigits = numString.replace(/\.?0+$/, "").length;
        const trailingZeros = numString.match(/0+$/)[0].length;
        const digitsToShow = Math.min(n, significantDigits);
        return numString.slice(0, digitsToShow);
    }

    return number.toPrecision(n);
}

export function interpolate(xList, yList, targetX, ) {
    // Input validation
    if (!Array.isArray(xList) || !Array.isArray(yList) || xList.length !== yList.length) {
        throw new Error('Invalid input: xList and yList must be arrays with the same length.');
    }

    // Check for ascending or descending order based on first and last elements
    const isDescending = xList[0] > xList[xList.length - 1];

    // Find the indices of the closest x values
    let lowerIndex = 0;
    let upperIndex = 0;
    if  (isDescending===true) {
        const index = xList.findIndex(x => x <= targetX);
        lowerIndex = index === -1 ? xList.length - 1 : Math.max(index - 1, 0);
        upperIndex = Math.min(index, xList.length - 1);
    } else {
        const index = xList.findIndex(x => x >= targetX);
        lowerIndex = index === -1 ? xList.length - 1 : Math.max(index - 1, 0);
        upperIndex = Math.min(index, xList.length - 1);
    }

    // Check if targetX is exactly equal to an existing x value
    if (xList[lowerIndex] === targetX) {
        return yList[lowerIndex];
    }

    // Check if we are at the edge. If so, we will do a linear extrapolation
    if ((lowerIndex === 0) && (upperIndex === 0)) {
        upperIndex = 1;
    }
    if ((lowerIndex === xList.length - 1) && (upperIndex === -1)) {
        upperIndex = lowerIndex;
        lowerIndex = upperIndex - 1;
    }

    // Perform linear interpolation
    const lowerX = xList[lowerIndex];
    const lowerY = yList[lowerIndex];
    const upperX = xList[upperIndex];
    const upperY = yList[upperIndex];
    const slope = (upperY - lowerY) / (upperX - lowerX);
    const interpolatedY = lowerY + slope * (targetX - lowerX);

    return interpolatedY;
}

export function getMinCenterMax(inputMinCenterMaxValue, inputBandwidthValue, inputMinCenterMax) {
    let minValue, centerValue, maxValue;

    switch (inputMinCenterMax) {
        case 'min':
            minValue = inputMinCenterMaxValue;
            centerValue = inputMinCenterMaxValue + inputBandwidthValue/2;
            maxValue = inputMinCenterMaxValue + inputBandwidthValue;
            break;
        case 'center':
            minValue = inputMinCenterMaxValue - inputBandwidthValue/2;
            centerValue = inputMinCenterMaxValue;
            maxValue = inputMinCenterMaxValue + inputBandwidthValue/2;
            break;
        case 'max':
            minValue = inputMinCenterMaxValue - inputBandwidthValue;
            centerValue = inputMinCenterMaxValue - inputBandwidthValue/2;
            maxValue = inputMinCenterMaxValue;
            break;
    }
    return [minValue, centerValue, maxValue];
}