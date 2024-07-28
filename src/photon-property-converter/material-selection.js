import {loadData, saveData} from "./utils.js";
import * as unitConversion from "./unit-conversion.js";

export let Materials = {
    air: {
        name: "Air",
        entryType: "data",
        wavelengthVacuumNanometers: [230, 244.6, 259.2, 273.8, 288.4, 303, 317.6, 332.2, 346.8, 361.4, 376, 390.6, 405.2, 419.8, 434.4, 449, 463.6, 478.2, 492.8, 507.4, 522, 536.6, 551.2, 565.8, 580.4, 595, 609.6, 624.2, 638.8, 653.4, 668, 682.6, 697.2, 711.8, 726.4, 741, 755.6, 770.2, 784.8, 799.4, 814, 828.6, 843.2, 857.8, 872.4, 887, 901.6, 916.2, 930.8, 945.4, 960, 974.6, 989.2, 1004, 1018, 1033, 1048, 1062, 1077, 1091, 1106, 1121, 1135, 1150, 1164, 1179, 1194, 1208, 1223, 1237, 1252, 1267, 1281, 1296, 1310, 1325, 1340, 1354, 1369, 1383, 1398, 1413, 1427, 1442, 1456, 1471, 1486, 1500, 1515, 1529, 1544, 1559, 1573, 1588, 1602, 1617, 1632, 1646, 1661, 1675, 1690],
        refractiveIndex: [1.000308003, 1.000303036, 1.00029911, 1.000295938, 1.000293329, 1.000291152, 1.000289313, 1.000287743, 1.000286391, 1.000285217, 1.000284191, 1.000283287, 1.000282488, 1.000281777, 1.000281141, 1.00028057, 1.000280056, 1.00027959, 1.000279168, 1.000278783, 1.000278432, 1.00027811, 1.000277814, 1.000277542, 1.000277291, 1.000277059, 1.000276844, 1.000276644, 1.000276458, 1.000276285, 1.000276123, 1.000275972, 1.000275831, 1.000275698, 1.000275573, 1.000275456, 1.000275346, 1.000275242, 1.000275144, 1.000275051, 1.000274964, 1.000274881, 1.000274802, 1.000274728, 1.000274657, 1.00027459, 1.000274526, 1.000274465, 1.000274407, 1.000274352, 1.000274299, 1.000274249, 1.0002742, 1.000274154, 1.000274111, 1.000274068, 1.000274027, 1.00027399, 1.000273951, 1.000273917, 1.000273882, 1.000273848, 1.000273818, 1.000273787, 1.000273759, 1.00027373, 1.000273702, 1.000273677, 1.000273651, 1.000273627, 1.000273603, 1.00027358, 1.000273559, 1.000273537, 1.000273518, 1.000273497, 1.000273478, 1.00027346, 1.000273442, 1.000273425, 1.000273408, 1.000273391, 1.000273376, 1.00027336, 1.000273346, 1.000273331, 1.000273317, 1.000273304, 1.00027329, 1.000273278, 1.000273265, 1.000273253, 1.000273242, 1.00027323, 1.000273219, 1.000273208, 1.000273197, 1.000273188, 1.000273177, 1.000273168, 1.000273158]
    }
};

function saveMaterialsToLocalStorage() {
    localStorage.setItem('Materials', JSON.stringify(Materials));
}

export function loadMaterialsFromLocalStorage() {
    const storedMaterials = loadData('Materials');
    if (storedMaterials) {
        Materials = JSON.parse(storedMaterials);
    }
}

export function calculateWavelengthMaterial(material) {
    if (material.entryType === 'data') {
        material.wavelengthMaterialNanometers = material.wavelengthVacuumNanometers.map(
            (wavelength, index) => wavelength / material.refractiveIndex[index]
        );
    }
}

export function calculateAllWavelengthMaterial() {
    Object.values(Materials).forEach(calculateWavelengthMaterial);
}

export function processCSVData(csvContent, wavelengthUnit, delimiter) {
    const lines = csvContent.split('\n');
    const wavelengthVacuumNanometers = [];
    const refractiveIndex = [];

    const conversionFactor = unitConversion.convertToMeters(1e9, wavelengthUnit);

    lines.forEach(line => {
        const [wavelength, index] = line.split(delimiter).map(Number);
        if (!isNaN(wavelength) && !isNaN(index)) {
            wavelengthVacuumNanometers.push(wavelength * conversionFactor);
            refractiveIndex.push(index);
        }
    });

    return { wavelengthVacuumNanometers, refractiveIndex };
}

export function handleMaterialSelection() {
    const checkbox = document.getElementById("materialSingleTextbox");
    if (checkbox.checked) {
        const textBox = document.getElementById("inputSingleRefractiveIndexValue");
        window.refractiveIndexData = {
            name: "Quick Value",
            entryType: "constant",
            refractiveIndex: parseFloat(textBox.value)
        };
    } else {
        const materialSelect = document.getElementById('materialSelect');
        const selectedMaterial = materialSelect.value;
        saveData('materialSelectValue', selectedMaterial);
        window.refractiveIndexData = Materials[selectedMaterial];
    }
}

export function openCustomMaterialModal() {
    document.getElementById('customMaterialModal').style.display = 'block';
}

export function closeCustomMaterialModal() {
    document.getElementById('customMaterialModal').style.display = 'none';
}

export function saveCustomMaterial() {
    const name = document.getElementById('customMaterialName').value;
    const inputType = document.querySelector('input[name="inputType"]:checked').value;
    const materialKey = name.toLowerCase().replaceAll(/\s+/g, '-');

    if (materialKey in Materials) {
        const userChoosesToProceed = confirm('Material with this name already exists. ' +
            'The existing entry will be overwritten. Proceed?');
        if (!userChoosesToProceed) {
            return;
        }
    }

    if (inputType === 'single') {
        const refractiveIndex = parseFloat(document.getElementById('refractiveIndexValue').value);
        Materials[materialKey] = {
            name: name,
            entryType: "constant",
            refractiveIndex: refractiveIndex
        };
        console.log(`Saved custom material: ${name} with refractive index: ${refractiveIndex}`);
        saveData('materialSelectValue', materialKey);
        saveMaterialsToLocalStorage();
        updateMaterialSelect();
        handleMaterialSelection();
        closeCustomMaterialModal();
    } else {
        const file = document.getElementById('refractiveIndexFile').files[0];
        const wavelengthUnit = document.getElementById('csvWavelengthUnit').value;
        const delimiter = document.getElementById('csvDelimiter').value;
        const reader = new FileReader();

        reader.onload = function(event) {
            const csvContent = event.target.result;
            const { wavelengthVacuumNanometers, refractiveIndex } =
                processCSVData(csvContent, wavelengthUnit, delimiter);

            Materials[materialKey] = {
                name: name,
                entryType: "data",
                wavelengthVacuumNanometers: wavelengthVacuumNanometers,
                refractiveIndex: refractiveIndex
            };

            calculateWavelengthMaterial(Materials[materialKey]);

            console.log(`Saved custom material: ${name} with file data`);
            saveData('materialSelectValue', materialKey);
            saveMaterialsToLocalStorage();
            updateMaterialSelect();
            handleMaterialSelection();
            closeCustomMaterialModal();
        };
        reader.readAsText(file);
    }
}

export function updateMaterialSelect() {
    const materialSelect = document.getElementById('materialSelect');
    materialSelect.innerHTML = ''; // Clear existing options

    // Add Air as the first option
    const airOption = document.createElement('option');
    airOption.value = 'air';
    airOption.textContent = Materials['air'].name;
    materialSelect.appendChild(airOption);

    // Get all other materials and sort them alphabetically
    const sortedMaterials = Object.entries(Materials)
        .filter(([key]) => key !== 'air')
        .sort(([, a], [, b]) => a.name.localeCompare(b.name));

    // Add sorted materials to the select element
    sortedMaterials.forEach(([key, material]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = material.name;
        materialSelect.appendChild(option);
    });

    // Set the selected value, defaulting to 'air' if the loaded value is not valid
    const loadedValue = loadData('materialSelectValue');
    if (loadedValue && materialSelect.querySelector(`option[value="${loadedValue}"]`)) {
        materialSelect.value = loadedValue;
    } else {
        materialSelect.value = 'air';
        saveData('materialSelectValue', 'air');  // Update stored value to reflect the change
    }
}

export function toggleInputType() {
    const singleValueInput = document.getElementById('singleValueInput');
    const fileUploadInput = document.getElementById('fileUploadInput');
    const inputTypeQuery = document.querySelector('input[name="inputType"]:checked');
    if (inputTypeQuery == null) return;
    const inputType = inputTypeQuery.value;

    if (inputType === 'single') {
        singleValueInput.style.display = 'block';
        fileUploadInput.style.display = 'none';
    } else {
        singleValueInput.style.display = 'none';
        fileUploadInput.style.display = 'block';
        if (loadData('csvWavelengthUnit') != null) {
            document.getElementById('csvWavelengthUnit').value = loadData('csvWavelengthUnit');
        }
        if (loadData('csvDelimiter') != null) {
            document.getElementById('csvDelimiter').value = loadData('csvDelimiter');
        }
    }
}

export function openDeleteMaterialModal() {
    const deleteModal = document.getElementById('deleteMaterialModal');
    const materialList = document.getElementById('materialList');
    materialList.innerHTML = '';

    // Get all materials except 'air' and sort them alphabetically
    const sortedMaterials = Object.entries(Materials)
        .filter(([key]) => key !== 'air')
        .sort(([, a], [, b]) => a.name.localeCompare(b.name));

    sortedMaterials.forEach(([key, material]) => {
        const listItem = document.createElement('div');  // Changed from 'li' to 'div'
        listItem.style.margin = '5px 0';  // Add some vertical spacing between items

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = key;
        checkbox.id = `delete-${key}`;

        const label = document.createElement('label');
        label.htmlFor = `delete-${key}`;
        label.textContent = material.name;
        label.style.marginLeft = '5px';  // Add some space between checkbox and label

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        materialList.appendChild(listItem);
    });

    deleteModal.style.display = 'block';
}

export function closeDeleteMaterialModal() {
    document.getElementById('deleteMaterialModal').style.display = 'none';
}

export function deleteSelectedMaterials() {
    const checkboxes = document.querySelectorAll('#materialList input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const materialKey = checkbox.value;
        delete Materials[materialKey];
    });

    saveMaterialsToLocalStorage();
    updateMaterialSelect();
    handleMaterialSelection();
    closeDeleteMaterialModal();
}

export function updateCSVWavelengthUnits() {
    const unitSelect = document.getElementById('csvWavelengthUnit');

    for (let unit of Object.keys(unitConversion.units['length'])) {
        let option = document.createElement("option");
        option.value = unit;
        option.text = unit.includes('u') ? unit.replace('u', 'μ') : unit;
        unitSelect.add(option);
    }
    unitSelect.value = loadData(unitSelect.id) || 'nm';
}