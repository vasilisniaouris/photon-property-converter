import * as unitConversion from './unit-conversion.js'
import * as utils from './utils.js'

const c = 299792458; // Speed of light in m*Hz
const h = 4.135667696E-15; // Planck's constant in eV/Hz
const h_bar = 6.5821220E-16; // h bar in eV/Hz
const hc = h * c;  // in eV*m
window.refractiveIndexData = null;

function getRefractiveIndex(wavelengthMeters, inputType) {

    let refractiveIndexData = window.refractiveIndexData;
    if (refractiveIndexData.entryType === "constant") {
        return refractiveIndexData.refractiveIndex;
    }

    // if (refractiveIndexData.entryType === "equation") {
    //     return eval(refractiveIndexData.equation);
    // }

    let refractiveIndex;

    switch (inputType) {
        case 'vacuum':
            refractiveIndex = utils.interpolate(
                refractiveIndexData.wavelengthVacuumNanometers, refractiveIndexData.refractiveIndex,
                unitConversion.convertFromMeters(wavelengthMeters, 'nm')
            );
            break;
        case 'material':
            refractiveIndex = utils.interpolate(
                refractiveIndexData.wavelengthMaterialNanometers, refractiveIndexData.refractiveIndex,
                unitConversion.convertFromMeters(wavelengthMeters, 'nm')
            );
            break;
    } 
    return refractiveIndex;
}

export function getAllPropertyValues(value, inputType, inputUnit) {

    let wavelengthVacuum, wavelengthMaterial, frequency, energy, waveNumberVacuum, nMaterial;

    switch (inputType) {
        case 'wavelength_vacuum':
            wavelengthVacuum = unitConversion.convertToMeters(value, inputUnit);
            nMaterial = getRefractiveIndex(wavelengthVacuum, 'vacuum');
            wavelengthMaterial = wavelengthVacuum / nMaterial;
            frequency = c / wavelengthVacuum;
            energy = hc / wavelengthVacuum;
            waveNumberVacuum = 1 / wavelengthVacuum;
            break;
        case 'wavelength_material':
            wavelengthMaterial = unitConversion.convertToMeters(value, inputUnit);
            nMaterial = getRefractiveIndex(wavelengthMaterial, 'material');
            wavelengthVacuum = wavelengthMaterial * nMaterial;
            frequency = c / wavelengthVacuum;
            energy = hc / wavelengthVacuum;
            waveNumberVacuum = 1 / wavelengthVacuum;
            break;
        case 'frequency':
            frequency = unitConversion.convertToHertz(value, inputUnit);
            wavelengthVacuum = c / frequency;
            nMaterial = getRefractiveIndex(wavelengthVacuum, 'vacuum');
            wavelengthMaterial = wavelengthVacuum / nMaterial;
            energy = h * frequency;
            waveNumberVacuum = 1 / wavelengthVacuum;
            break;
        case 'energy':
            energy = unitConversion.convertToEV(value, inputUnit);
            frequency = energy / h;
            wavelengthVacuum = c / frequency;
            nMaterial = getRefractiveIndex(wavelengthVacuum, 'vacuum');
            wavelengthMaterial = wavelengthVacuum / nMaterial;
            waveNumberVacuum = 1 / wavelengthVacuum;
            break;
        case 'wave_number_vacuum':
            waveNumberVacuum = unitConversion.convertToInverseMeters(value, inputUnit);
            wavelengthVacuum = 1 / waveNumberVacuum;
            nMaterial = getRefractiveIndex(wavelengthVacuum, 'vacuum');
            wavelengthMaterial = wavelengthVacuum / nMaterial;
            frequency = c / wavelengthVacuum;
            energy = hc / wavelengthVacuum;
            break;
    }
    return [wavelengthVacuum, wavelengthMaterial, frequency, energy, waveNumberVacuum, nMaterial];
}

export let propertyUnits = {
    wavelength_vacuum : Object.keys(unitConversion.units['length']),
    wavelength_material : Object.keys(unitConversion.units['length']),
    frequency : Object.keys(unitConversion.units['frequency']),
    energy : Object.keys(unitConversion.units['energy']),
    wave_number_vacuum : Object.keys(unitConversion.units['inverse_length']),
};

export let defaultPropertyUnits = {
    wavelength_vacuum : {line: 'nm', bandwidth: 'pm'},
    wavelength_material : {line: 'nm', bandwidth: 'pm'},
    frequency : {line: 'THz', bandwidth: 'GHz'},
    energy : {line: 'eV', bandwidth: 'ueV'},
    wave_number_vacuum : {line: '1/cm', bandwidth: '1/m'},
};

export let propertyTypes = {
    wavelength_vacuum : 'Wavelength (Vacuum)',
    wavelength_material : 'Wavelength (Material)',
    frequency : 'Frequency',
    energy : 'Energy',
    wave_number_vacuum : 'Wave Number (Vacuum)',
};

export let defaultPropertyType = 'wavelength_material';
