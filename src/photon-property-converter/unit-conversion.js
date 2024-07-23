function convertToMeters(value, unit) {
    const units = {
        'pm': 1e-12,
        'nm': 1e-9,
        'um': 1e-6,
        'μm': 1e-6,
        'mm': 1e-3,
        'cm': 1e-2,
        'm': 1
    };
    return value * units[unit];
}

function convertFromMeters(value, unit) {
    const units = {
        'pm': 1e12,
        'nm': 1e9,
        'um': 1e6,
        'μm': 1e6,
        'mm': 1e3,
        'cm': 1e2,
        'm': 1
    };
    return value * units[unit];
}

function convertToInverseMeters(value, unit) {
    const units = {
        '1/pm': 1e12,
        '1/nm': 1e9,
        '1/um': 1e6,
        '1/μm': 1e6,
        '1/mm': 1e3,
        '1/cm': 1e2,
        '1/m': 1
    };
    return value * units[unit];
}

function convertFromInverseMeters(value, unit) {
    const units = {
        '1/pm': 1e-12,
        '1/nm': 1e-9,
        '1/um': 1e-6,
        '1/μm': 1e-6,
        '1/mm': 1e-3,
        '1/cm': 1e-2,
        '1/m': 1
    };
    return value * units[unit];
}

function convertToHertz(value, unit) {
    const units = {
        'Hz': 1,
        'kHz': 1e3,
        'MHz': 1e6,
        'GHz': 1e9,
        'THz': 1e12
    };
    return value * units[unit];
}

function convertFromHertz(value, unit) {
    const units = {
        'Hz': 1,
        'kHz': 1e-3,
        'MHz': 1e-6,
        'GHz': 1e-9,
        'THz': 1e-12
    };
    return value * units[unit];
}

function convertToEV(value, unit) {
    const units = {
        'eV': 1,
        'meV': 1e-3,
        'ueV': 1e-6,
        'μeV': 1e-6,
        'neV': 1e-9
    };
    return value * units[unit];
}

function convertFromEV(value, unit) {
    const units = {
        'eV': 1,
        'meV': 1e3,
        'ueV': 1e6,
        'μeV': 1e6,
        'neV': 1e9
    };
    return value * units[unit];
}


export {convertToMeters, convertFromMeters, convertToInverseMeters, convertFromInverseMeters,
    convertToHertz, convertFromHertz, convertToEV, convertFromEV};
