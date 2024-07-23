import * as unitConversion from './unit-conversion.js'
import * as utils from './utils.js'

const c = 299792458; // Speed of light in m/s
const h = 4.135667696E-15; // Planck's constant in eV/Hz
const h_bar = 6.5821220E-16; // h bar in eV/Hz
const hc = h * c;
const refractiveIndexData = {
    wavelengthVacuumNanometers: [230, 244.6, 259.2, 273.8, 288.4, 303, 317.6, 332.2, 346.8, 361.4, 376, 390.6, 405.2, 419.8, 434.4, 449, 463.6, 478.2, 492.8, 507.4, 522, 536.6, 551.2, 565.8, 580.4, 595, 609.6, 624.2, 638.8, 653.4, 668, 682.6, 697.2, 711.8, 726.4, 741, 755.6, 770.2, 784.8, 799.4, 814, 828.6, 843.2, 857.8, 872.4, 887, 901.6, 916.2, 930.8, 945.4, 960, 974.6, 989.2, 1004, 1018, 1033, 1048, 1062, 1077, 1091, 1106, 1121, 1135, 1150, 1164, 1179, 1194, 1208, 1223, 1237, 1252, 1267, 1281, 1296, 1310, 1325, 1340, 1354, 1369, 1383, 1398, 1413, 1427, 1442, 1456, 1471, 1486, 1500, 1515, 1529, 1544, 1559, 1573, 1588, 1602, 1617, 1632, 1646, 1661, 1675, 1690],
    refractiveIndex: [1.000308003, 1.000303036, 1.00029911, 1.000295938, 1.000293329, 1.000291152, 1.000289313, 1.000287743, 1.000286391, 1.000285217, 1.000284191, 1.000283287, 1.000282488, 1.000281777, 1.000281141, 1.00028057, 1.000280056, 1.00027959, 1.000279168, 1.000278783, 1.000278432, 1.00027811, 1.000277814, 1.000277542, 1.000277291, 1.000277059, 1.000276844, 1.000276644, 1.000276458, 1.000276285, 1.000276123, 1.000275972, 1.000275831, 1.000275698, 1.000275573, 1.000275456, 1.000275346, 1.000275242, 1.000275144, 1.000275051, 1.000274964, 1.000274881, 1.000274802, 1.000274728, 1.000274657, 1.00027459, 1.000274526, 1.000274465, 1.000274407, 1.000274352, 1.000274299, 1.000274249, 1.0002742, 1.000274154, 1.000274111, 1.000274068, 1.000274027, 1.00027399, 1.000273951, 1.000273917, 1.000273882, 1.000273848, 1.000273818, 1.000273787, 1.000273759, 1.00027373, 1.000273702, 1.000273677, 1.000273651, 1.000273627, 1.000273603, 1.00027358, 1.000273559, 1.000273537, 1.000273518, 1.000273497, 1.000273478, 1.00027346, 1.000273442, 1.000273425, 1.000273408, 1.000273391, 1.000273376, 1.00027336, 1.000273346, 1.000273331, 1.000273317, 1.000273304, 1.00027329, 1.000273278, 1.000273265, 1.000273253, 1.000273242, 1.00027323, 1.000273219, 1.000273208, 1.000273197, 1.000273188, 1.000273177, 1.000273168, 1.000273158]
};
refractiveIndexData.wavelengthMaterialNanometers = refractiveIndexData.wavelengthVacuumNanometers.map(
    (wavelength, index) => {return wavelength / refractiveIndexData.refractiveIndex[index];});

function getRefractiveIndex(wavelengthMeters, inputType) {
    
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
        case 'wavelength_air':
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