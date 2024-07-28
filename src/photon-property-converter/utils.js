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

export function camelCaseToDash(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function dashToCamelCase(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

export function underscoreToCamelCase(str) {
    return str.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

// export function underscoreToPascalCase(str) {
//     return str.replace(/(^|_)([a-z])/g, function (g) { return g[1].toUpperCase(); });
// }

export function underscoreToPascalCase(str) {
    return str.replace(/(^|_)([a-z])/g, function (match, p1, p2) { return p2.toUpperCase(); });
}

export function saveData(key, value) {
    localStorage.setItem(key, value);
}

export function loadData(key) {
    return localStorage.getItem(key);
}
export function removeData(key) {
    localStorage.removeItem(key);
}
export function clearData() {
    localStorage.clear();
}

export function clearPreferencesData(){
    const materials = loadData('Materials');
    clearData();
    if (materials != null) saveData('Materials', materials);
}
// export function isDataStored(key) {
//     return localStorage.getItem(key) !== null;
// }
// export function getAllData() {
//     return localStorage;
// }
// export function getAllKeys() {
//     return Object.keys(localStorage);
// }
// export function getAllValues() {
//     return Object.values(localStorage);
// }
// export function getAllEntries() {
//     return Object.entries(localStorage);
// }

function toggleTheme() {
    // Check current theme from localStorage
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Toggle between light and dark themes
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}