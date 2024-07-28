export let units = {
    length : {'fm': 1e-15, 'pm': 1e-12, 'nm': 1e-9, 'um': 1e-6, 'mm': 1e-3, 'cm': 1e-2, 'm': 1},
    frequency : {'Hz': 1, 'kHz': 1e3, 'MHz': 1e6, 'GHz': 1e9, 'THz':1e12},
    energy : {'peV': 1e-12, 'neV': 1e-9, 'ueV': 1e-6, 'meV': 1e-3, 'eV': 1},
    inverse_length : {'1/km': 1e-3, '1/m': 1, '1/cm': 1e2, '1/mm': 1e3, '1/um': 1e6, '1/nm': 1e9, '1/pm': 1e12},
};

function convertToMeters(value, unit) {
    return value * units['length'][unit];
}

function convertFromMeters(value, unit) {
    return value / units['length'][unit];
}

function convertToInverseMeters(value, unit) {
    return value * units['inverse_length'][unit];
}

function convertFromInverseMeters(value, unit) {
    return value / units['inverse_length'][unit];
}

function convertToHertz(value, unit) {
    return value * units['frequency'][unit];
}

function convertFromHertz(value, unit) {
    return value / units['frequency'][unit];
}

function convertToEV(value, unit) {
    return value * units['energy'][unit];
}

function convertFromEV(value, unit) {
    return value / units['energy'][unit];
}

export {convertToMeters, convertFromMeters, convertToInverseMeters, convertFromInverseMeters,
    convertToHertz, convertFromHertz, convertToEV, convertFromEV};
