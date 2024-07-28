import {
    defaultPropertyType,
    defaultPropertyUnits,
    getAllPropertyValues,
    propertyTypes,
    propertyUnits
} from "./spectroscopy.js";
import {camelCaseToDash, clearData, clearPreferencesData, loadData, saveData, underscoreToPascalCase} from "./utils.js";
import {convertLine, convertBandwidth} from "./property-converters.js";
import {
    calculateAllWavelengthMaterial,
    closeCustomMaterialModal,
    closeDeleteMaterialModal,
    deleteSelectedMaterials,
    handleMaterialSelection,
    loadMaterialsFromLocalStorage,
    Materials,
    openCustomMaterialModal,
    openDeleteMaterialModal,
    saveCustomMaterial,
    toggleInputType, updateCSVWavelengthUnits,
    updateMaterialSelect
} from "./material-selection.js";
import {convertFromMeters, convertToMeters} from "./unit-conversion.js";

export function updateInputUnits(entry) {

    const entryType = entry.includes('Bandwidth') ? 'bandwidth' : 'line';
    let inputType = document.getElementById(entry + "Type").value;
    let unitSelect = document.getElementById(entry + "Unit");
    unitSelect.innerHTML = "";

    for (let unit of propertyUnits[inputType]) {
        let option = document.createElement("option");
        option.value = unit;
        option.text = unit.includes('u') ? unit.replace('u', 'μ') : unit;
        unitSelect.add(option);
    }
    let dataKey = unitSelect.id + underscoreToPascalCase(inputType);
    if (loadData(dataKey) == null) {
        saveData(dataKey, defaultPropertyUnits[inputType][entryType]);
    }
    unitSelect.value = loadData(dataKey);
}

export function updateOutputUnits(unitEntry) {

    const entryType = unitEntry.includes('Bandwidth') ? 'bandwidth' : 'line';
    let outputType = camelCaseToDash(unitEntry).replace('output-'+entryType+'-unit-', '').replaceAll('-', '_');
    let unitSelect = document.getElementById(unitEntry);
    unitSelect.innerHTML = "";

    for (let unit of propertyUnits[outputType]) {
        let option = document.createElement("option");
        option.value = unit;
        option.text = unit.includes('u') ? unit.replace('u', 'μ') : unit;
        unitSelect.add(option);
    }
    if (loadData(unitSelect.id) == null) {
        saveData(unitSelect.id, defaultPropertyUnits[outputType][entryType]);
    }
    unitSelect.value = loadData(unitSelect.id);
}

export function updateInputPropertyType(entry) {
    let typeSelect = document.getElementById(entry);
    typeSelect.innerHTML = "";

    for (let typeKey of Object.keys(propertyTypes)) {
        let option = document.createElement("option");
        option.value = typeKey;
        option.text = propertyTypes[typeKey];
        typeSelect.add(option);
    }
    if (loadData(typeSelect.id) == null) {
        saveData(typeSelect.id, defaultPropertyType);
    }
    typeSelect.value = loadData(typeSelect.id);
}

export function toggleTheme() {
    const currentTheme = document.documentElement.style.colorScheme;
    document.documentElement.style.colorScheme = currentTheme === 'light'? 'dark' : 'light';
    localStorage.setItem('theme', document.documentElement.style.colorScheme);
}

export function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.style.colorScheme = savedTheme;
    } else {
        document.documentElement.style.colorScheme =
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

function onToggleQuickValueAction() {
    const checkbox = document.getElementById("materialSingleTextbox");
    const selectBox = document.getElementById("materialSelect");
    const textBox = document.getElementById("inputSingleRefractiveIndexValue");
    const addCustomMaterialButton = document.getElementById('addCustomMaterialButton');
    const openDeleteMaterialModal = document.getElementById('openDeleteMaterialModal');

    if (checkbox.checked) {
        selectBox.disabled = true;
        addCustomMaterialButton.disabled = true;
        openDeleteMaterialModal.disabled = true;
        textBox.disabled = false;
    } else {
        selectBox.disabled = false;
        addCustomMaterialButton.disabled = false;
        openDeleteMaterialModal.disabled = false;
        textBox.disabled = true;
    }
    saveData(checkbox.id + "IsChecked", checkbox.checked);
    handleMaterialSelection();
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const arrow = section.previousElementSibling.querySelector('.arrow');
    const container = section.closest('.container');  // Assuming each section is within a .container div

    if (section.style.display === 'none') {
        // Expanding the section
        section.style.display = 'block';
        arrow.textContent = '▼';
        container.style.height = 'auto';  // Reset to auto height
        container.style.minHeight = '';   // Remove any minimum height
    } else {
        // Collapsing the section
        section.style.display = 'none';
        arrow.textContent = '▶';

        // Set a minimum height for the collapsed state
        const headerHeight = section.previousElementSibling.offsetHeight;
        container.style.height = `${headerHeight}px`;  // 20px for padding
        container.style.minHeight = `${headerHeight}px`;
    }
}

function setRefractiveAlertMessage(minWave, maxWave, type) {
    document.getElementById(`${type}AlertTooltip`).innerHTML =
        `Warning: Using linearly extrapolated ref. index.<br>Valid vac. range: ${minWave}-${maxWave} nm`;
}

function checkRefractiveIndexAlert(type) {
    if (window.refractiveIndexData.entryType === 'constant') {
        document.getElementById(type+'Alert').style.display = 'none';
        return;
    }
    const minWavelength = window.refractiveIndexData.wavelengthVacuumNanometers[0];
    const maxWavelength = window.refractiveIndexData.wavelengthVacuumNanometers[
        window.refractiveIndexData.wavelengthVacuumNanometers.length - 1];
    setRefractiveAlertMessage(minWavelength, maxWavelength, type);
    let resultMinWavelength, resultMaxWavelength;

    if (type === 'line') {
        resultMinWavelength = parseFloat(document.getElementById('result-line-wavelength-vacuum').textContent);
        const resultUnit = document.getElementById('outputLineUnitWavelengthVacuum').value;
        resultMinWavelength = convertFromMeters(convertToMeters(resultMinWavelength, resultUnit), 'nm');
        resultMaxWavelength = resultMinWavelength;
    } else {
        const inputValue = parseFloat(document.getElementById("inputMinCenterMaxValue").value);
        const inputType = document.getElementById("inputMinCenterMaxType").value;
        const inputUnit = document.getElementById("inputMinCenterMaxUnit").value;

        const wavelength = getAllPropertyValues(inputValue, inputType, inputUnit)[0];

        const wavelengthBandwidthUnit = document.getElementById('outputBandwidthUnitWavelengthVacuum').value;
        let wavelengthBandwidth = parseFloat(document.getElementById('result-bandwidth-wavelength-vacuum').textContent);
        wavelengthBandwidth = convertToMeters(wavelengthBandwidth, wavelengthBandwidthUnit);

        console.log(wavelength, wavelengthBandwidth);
        resultMaxWavelength = wavelength + wavelengthBandwidth / 2;
        resultMinWavelength = wavelength - wavelengthBandwidth / 2;
        resultMinWavelength = convertFromMeters(resultMinWavelength, 'nm');
        resultMaxWavelength = convertFromMeters(resultMaxWavelength, 'nm');

    }
    if (resultMinWavelength < minWavelength || resultMaxWavelength > maxWavelength) {
        document.getElementById(type + 'Alert').style.display = 'inline-block';
    } else {
        document.getElementById(type + 'Alert').style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const convertLineButton = document.getElementById('convertLineButton');
    convertLineButton.addEventListener('click', function (){
        convertLine();
        checkRefractiveIndexAlert('line');
    });

    const convertBandwidthButton = document.getElementById('convertBandwidthButton');
    convertBandwidthButton.addEventListener('click', function () {
        convertBandwidth();
        checkRefractiveIndexAlert('bandwidth');
    });

    const clearPreferencesButton = document.getElementById('clearPreferencesButton');
    clearPreferencesButton.addEventListener('click', clearPreferencesData);

    // const clearAllButton = document.getElementById('clearAllButton');
    // clearAllButton.addEventListener('click', clearData);

    const toggleThemeButton = document.getElementById('toggleThemeButton');
    toggleThemeButton.addEventListener('click', toggleTheme);
    setInitialTheme();

    const checkbox = document.getElementById("materialSingleTextbox");
    checkbox.addEventListener("change", onToggleQuickValueAction);

    loadMaterialsFromLocalStorage();
    calculateAllWavelengthMaterial();
    updateMaterialSelect();
    onToggleQuickValueAction();

    const quickValueTextbox = document.getElementById('inputSingleRefractiveIndexValue');
    quickValueTextbox.addEventListener('change', handleMaterialSelection);

    const materialSelect = document.getElementById('materialSelect');
    materialSelect.addEventListener('change', handleMaterialSelection);

    const addCustomMaterialButton = document.getElementById('addCustomMaterialButton');
    addCustomMaterialButton.addEventListener('click', openCustomMaterialModal);

    const closeModalButton = document.getElementById('closeModal');
    closeModalButton.addEventListener('click', closeCustomMaterialModal);

    const saveCustomMaterialButton = document.getElementById('saveCustomMaterial');
    saveCustomMaterialButton.addEventListener('click', saveCustomMaterial);

    const inputTypeRadios = document.querySelectorAll('input[name="inputType"]');
    inputTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleInputType);
    });
    toggleInputType();

    const csvWavelengthUnitSelect = document.getElementById('csvWavelengthUnit');
    csvWavelengthUnitSelect.addEventListener('change', function () {
        saveData(csvWavelengthUnitSelect.id, csvWavelengthUnitSelect.value);
    });

    const csvDelimiter = document.getElementById('csvDelimiter');
    csvDelimiter.addEventListener('change', function (){
        saveData(csvDelimiter.id, csvDelimiter.value);
    });

    document.getElementById('openDeleteMaterialModal').addEventListener('click', openDeleteMaterialModal);
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteMaterialModal);
    document.getElementById('deleteSelectedMaterials').addEventListener('click', deleteSelectedMaterials);

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleSection(btn.dataset.target));
    });
    document.querySelectorAll('.container').forEach(container => {
        const section = container.querySelector('[id$="Content"]');
        const header = section.previousElementSibling;
        const headerHeight = header.offsetHeight;

        // Set initial height
        if (section.style.display === 'none') {
            container.style.height = `${headerHeight}px`;
            container.style.minHeight = `${headerHeight}px`;
        } else {
            container.style.height = 'auto';
            container.style.minHeight = '';
        }
    });
});

let inputEntries = ['inputLine', 'inputBandwidth', 'inputMinCenterMax'];
for (let entry of inputEntries) {
    document.addEventListener("DOMContentLoaded", function () {
        updateInputPropertyType(entry + "Type");
        updateInputUnits(entry);
        document.getElementById(entry + "Type").addEventListener("change", function() {
            saveData(entry + "Type", document.getElementById(entry + "Type").value);
            updateInputUnits(entry);
        });
        document.getElementById(entry + "Unit").addEventListener("change", function () {
            saveData(entry + "Unit" + underscoreToPascalCase(document.getElementById(entry + "Type").value),
                document.getElementById(entry + "Unit").value);
        });
    });
}
let outputUnitElements = document.querySelectorAll('[id*="Unit"][id*="output"]');
outputUnitElements.forEach(element => {
    updateOutputUnits(element.id);
    element.addEventListener("change", function () {
        saveData(element.id, element.value);
        element.id.includes('Bandwidth') ? convertBandwidth() : convertLine();
    });
})

updateCSVWavelengthUnits();