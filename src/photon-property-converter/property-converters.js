import {getAllPropertyValues} from "./spectroscopy.js";
import {showNSignificantDigits, getMinCenterMax} from "./utils.js";
import * as unitConversion from "./unit-conversion.js";

const displayedSignificantDigits = 8;

export function convertLine() {
    let value = parseFloat(document.getElementById("inputLineValue").value);
    let inputType = document.getElementById("inputLineType").value;
    let inputUnit = document.getElementById("inputLineUnit").value;
    let outputUnitWavelengthVacuum = document.getElementById("outputLineUnitWavelengthVacuum").value;
    let outputUnitWavelengthMaterial = document.getElementById("outputLineUnitWavelengthMaterial").value;
    let outputUnitFrequency = document.getElementById("outputLineUnitFrequency").value;
    let outputUnitEnergy = document.getElementById("outputLineUnitEnergy").value;
    let outputUnitWaveNumberVacuum = document.getElementById("outputLineUnitWaveNumberVacuum").value;

    let wavelengthVacuum, wavelengthMaterial, frequency, energy, waveNumberVacuum, nMaterial;

    [wavelengthVacuum, wavelengthMaterial, frequency, energy, waveNumberVacuum, nMaterial] =
        getAllPropertyValues(value, inputType, inputUnit);

    const result_wavelength_vacuum = showNSignificantDigits(
        unitConversion.convertFromMeters(wavelengthVacuum, outputUnitWavelengthVacuum), displayedSignificantDigits);
    const result_wavelength_material = showNSignificantDigits(
        unitConversion.convertFromMeters(wavelengthMaterial, outputUnitWavelengthMaterial), displayedSignificantDigits);
    const result_frequency = showNSignificantDigits(
        unitConversion.convertFromHertz(frequency, outputUnitFrequency), displayedSignificantDigits);
    const result_energy = showNSignificantDigits(
        unitConversion.convertFromEV(energy, outputUnitEnergy), displayedSignificantDigits);
    const result_wave_number_vacuum = showNSignificantDigits(
        unitConversion.convertFromInverseMeters(waveNumberVacuum, outputUnitWaveNumberVacuum), displayedSignificantDigits);
    const result_refractive_index = showNSignificantDigits(
        nMaterial - 1, displayedSignificantDigits);

    document.getElementById("result-line-wavelength-vacuum").innerHTML = `${result_wavelength_vacuum}`;
    document.getElementById("result-line-wavelength-material").innerHTML = `${result_wavelength_material}`;
    document.getElementById("result-line-frequency").innerHTML = `${result_frequency}`;
    document.getElementById("result-line-energy").innerHTML = `${result_energy}`;
    document.getElementById("result-line-wave-number-vacuum").innerHTML = `${result_wave_number_vacuum}`;
    document.getElementById("result-line-refractive-index").innerHTML = `${result_refractive_index}`;
}

export function convertBandwidth() {
    let inputBandwidthValue = parseFloat(document.getElementById("inputBandwidthValue").value);
    let inputBandwidthUnit = document.getElementById("inputBandwidthUnit").value;
    let inputBandwidthType = document.getElementById("inputBandwidthType").value;

    // let inputMinCenterMax = parseFloat(document.getElementById("inputMinCenterMax").value);
    let inputMinCenterMaxValue = parseFloat(document.getElementById("inputMinCenterMaxValue").value);
    let inputMinCenterMaxUnit = document.getElementById("inputMinCenterMaxUnit").value;
    let inputMinCenterMaxType = document.getElementById("inputMinCenterMaxType").value;

    let outputUnitWavelengthVacuum = document.getElementById("outputBandwidthUnitWavelengthVacuum").value;
    let outputUnitWavelengthMaterial = document.getElementById("outputBandwidthUnitWavelengthMaterial").value;
    let outputUnitFrequency = document.getElementById("outputBandwidthUnitFrequency").value;
    let outputUnitEnergy = document.getElementById("outputBandwidthUnitEnergy").value;
    let outputUnitWaveNumberVacuum = document.getElementById("outputBandwidthUnitWaveNumberVacuum").value;

    let wavelengthVacuum, wavelengthMaterial, frequency, energy, waveNumberVacuum, nMaterial;

    [wavelengthVacuum, wavelengthMaterial, frequency, energy, waveNumberVacuum, nMaterial] =
        getAllPropertyValues(inputMinCenterMaxValue, inputMinCenterMaxType, inputMinCenterMaxUnit);

    let wavelengthVacuumMin, wavelengthVacuumCenter, wavelengthVacuumMax, wavelengthVacuumBandwidth;
    let wavelengthMaterialMin, wavelengthMaterialCenter, wavelengthMaterialMax, wavelengthMaterialBandwidth;
    let frequencyMin, frequencyCenter, frequencyMax, frequencyBandwidth;
    let energyMin, energyCenter, energyMax, energyBandwidth;
    let waveNumberVacuumMin, waveNumberVacuumCenter, waveNumberVacuumMax, waveNumberVacuumBandwidth;
    let nMaterialMin, nMaterialCenter, nMaterialMax, nMaterialBandwidth;

    let bandwidth, minValue, centerValue, maxValue;

    let initialValue = {
        wavelength_vacuum : wavelengthVacuum,
        wavelength_material : wavelengthMaterial,
        frequency : frequency,
        energy : energy,
        wave_number_vacuum : waveNumberVacuum,
    };

    const conversionMethods = {
        wavelength_vacuum : unitConversion.convertToMeters,
        wavelength_material : unitConversion.convertToMeters,
        frequency : unitConversion.convertToHertz,
        energy : unitConversion.convertToEV,
        wave_number_vacuum : unitConversion.convertToInverseMeters,
    };
    const baseUnits = {
        wavelength_vacuum : 'm',
        wavelength_material : 'm',
        frequency : 'Hz',
        energy : 'eV',
        wave_number_vacuum : '1/m',
    };
    const conversionMethod = conversionMethods[inputBandwidthType];
    const baseUnit = baseUnits[inputBandwidthType];

    bandwidth = conversionMethod(inputBandwidthValue, inputBandwidthUnit);
    [minValue, centerValue, maxValue] = getMinCenterMax(
        initialValue[inputBandwidthType], bandwidth, 'center');
    [wavelengthVacuumMin, wavelengthMaterialMin, frequencyMin, energyMin, waveNumberVacuumMin, nMaterialMin] =
        getAllPropertyValues(minValue, inputBandwidthType, baseUnit);
    [wavelengthVacuumCenter, wavelengthMaterialCenter, frequencyCenter, energyCenter, waveNumberVacuumCenter, nMaterialCenter] =
        getAllPropertyValues(centerValue, inputBandwidthType, baseUnit);
    [wavelengthVacuumMax, wavelengthMaterialMax, frequencyMax, energyMax, waveNumberVacuumMax, nMaterialMax] =
        getAllPropertyValues(maxValue, inputBandwidthType, baseUnit);

    wavelengthVacuumBandwidth = Math.abs(wavelengthVacuumMax - wavelengthVacuumMin);
    wavelengthMaterialBandwidth = Math.abs(wavelengthMaterialMax - wavelengthMaterialMin);
    frequencyBandwidth = Math.abs(frequencyMax - frequencyMin);
    energyBandwidth = Math.abs(energyMax - energyMin);
    waveNumberVacuumBandwidth = Math.abs(waveNumberVacuumMax - waveNumberVacuumMin);
    nMaterialBandwidth = Math.abs(nMaterialMax - nMaterialMin);

    const result_wavelength_vacuum = showNSignificantDigits(
        unitConversion.convertFromMeters(wavelengthVacuumBandwidth, outputUnitWavelengthVacuum), displayedSignificantDigits);
    const result_wavelength_material = showNSignificantDigits(
        unitConversion.convertFromMeters(wavelengthMaterialBandwidth, outputUnitWavelengthMaterial), displayedSignificantDigits);
    const result_frequency = showNSignificantDigits(
        unitConversion.convertFromHertz(frequencyBandwidth, outputUnitFrequency), displayedSignificantDigits);
    const result_energy = showNSignificantDigits(
        unitConversion.convertFromEV(energyBandwidth, outputUnitEnergy), displayedSignificantDigits);
    const result_wave_number_vacuum = showNSignificantDigits(
        unitConversion.convertFromInverseMeters(waveNumberVacuumBandwidth, outputUnitWaveNumberVacuum), displayedSignificantDigits);
    const result_refractive_index = showNSignificantDigits(
        nMaterialBandwidth, displayedSignificantDigits);

    document.getElementById("result-bandwidth-wavelength-vacuum").innerHTML = `${result_wavelength_vacuum}`;
    document.getElementById("result-bandwidth-wavelength-material").innerHTML = `${result_wavelength_material}`;
    document.getElementById("result-bandwidth-frequency").innerHTML = `${result_frequency}`;
    document.getElementById("result-bandwidth-energy").innerHTML = `${result_energy}`;
    document.getElementById("result-bandwidth-wave-number-vacuum").innerHTML = `${result_wave_number_vacuum}`;
    document.getElementById("result-bandwidth-refractive-index").innerHTML = `${result_refractive_index}`;
}
