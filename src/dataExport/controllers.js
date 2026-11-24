const {clauses,createQuery,sendQueryTA} = require('./soqlStructure');

const today = new Date();

const getWorkFlowRules = async()=>{
	const {object,fields} = require("../sObjects/WorkflowRule");
	const queryLh = createQuery(object,clauses.c + 'Id)');
	const lh = await sendQueryTA(queryLh);
	const {expr0} = lh.records[0];

	console.log(`${today}: controllers.getWorkFlowRules: `);
	//console.log(`****** Successfully data exported of object: ${object} ******`);
	//console.log('data Object: ' + JSON.stringify(lh,null,2));
	console.log(`${object}.length: ${expr0}`);

  let recordsWfr = [{
		Id:'',
		type:'',
		Name:'',
		actionsName:'',
		object:'',
		active:''
	}];
	let query;
	let wfR;
	let wrfIds = [];
	let wfrIdString;

	for(let i=0 ; i<=(expr0-1) ; i++){
		if(wrfIds.length != 0){
			console.log('wrfIds: ' + wrfIds);
			query = createQuery(object,fields) + clauses.w + 'Id' + clauses.nI + wfrIdString + clauses.l + '1';
			//console.log('Query (Si): ' + query);
			wfR = await sendQueryTA(query);
		}else{
			query = createQuery(object,fields) + clauses.l + '1';
			//console.log('Query (No): ' + query);
			wfR = await sendQueryTA(query);
		}

		let {Id,Name,TableEnumOrId,type} = wfR.records[0];
		let {active,name} = wfR.records[0].Metadata;
		wrfIds[i] = Id;
		wfrIdString = `('${wrfIds.join("','")}')`;
		if(!active){
			recordsWfr.push({
				Id:Id,
				type:type,
				Name:Name,
				actionsName:name,
				object:TableEnumOrId,
				active:active
			});
		}
	}
	return recordsWfr;
};

const getLCB = async()=>{
	/*const {object,fields} = require("../sObjects/LigthninhComponentBundle");
	console.time(`===================== ${object}: Data Export Start =========================`);
	const queryLh = createQuery(object,clauses.c + 'Id)');
	const lh = await sendQueryTA(queryLh);
	const {expr0} = lh.records[0];
	console.log(`${today}: controllers.getLCB: `);
	console.log(`${object}.length: ${expr0}`);
	console.log(object + ': Total Records: ' + wrfIds.length);*/
};

const exportExcel = async(object)=>{
	const ExcelJs = require('exceljs');

	const workBook = new ExcelJs.Workbook();
	const workSheet = workBook.addWorksheet(object);

	switch(object){
		case 'WorkflowRules':
			console.time(`===================== ${object}: Data Export Start =========================`);
			const wfR = await getWorkFlowRules();
			console.log(`${today}: controllers.exportExcell: `);
			console.log(object + ': Total Records Inactives: ' + wfR.length);
			workSheet.columns = [
        { header: 'Id', key: 'Id', width: 15, style: { numFmt: '@' } },
        { header: 'Name', key: 'Name', width: 25, style: { numFmt: '@' } },
        { header: 'Object', key: 'object', width: 20, style: { numFmt: '@' } },
        { header: 'Active', key: 'active', width: 18, style: { numFmt: '@' } }
    	];
			console.log('Data WFR: ' + JSON.stringify(wfR,null,2));
			workSheet.addRows(wfR);
			console.timeEnd(`===================== ${object}: Data Export End =========================`);
			break;
		default:
	}

	const path = 'C:\\Users\\HP\\Downloads\\';
	const nameBook = path + 'Export_' + object + '.xlsx';
	try {
		await workBook.xlsx.writeFile(nameBook);

	} catch (error) {
		console.log(`${today}: controllers.exportExcell.error: ` + error);
	}

}


module.exports = {
    getWorkFlowRules,sendQueryTA,getLCB,exportExcel
};
