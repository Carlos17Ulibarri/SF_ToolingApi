const {getWorkFlowRules,getLCB} = require("./src/dataExport/controllers");

//getWorkFlowRules();

getLCB();


/*
const idsYaExportados = [
      '01Q07000000g4DbEAI',
      '01Q07000000g4XYZ12',
      '01Q07000000g4ABC34'
    ];

    // 2. Convertir el arreglo de JS al formato de lista de strings requerido por SOQL
    // Esto transforma ['A', 'B'] en: ('A', 'B')
    const listaIdsFormatos = `('${idsYaExportados.join("', '")}')`;
*/
