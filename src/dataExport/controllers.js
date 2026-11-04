const {getConn} = require("../connection");
const {clauses} = require("./soqlStructure");

const today = new Date();

const createQuery = (sObject,fields)=>{
	const query = clauses.s + fields + clauses.f + sObject;
	return query;
};


const sendQueryTA = async (qy)=>{
	try {
		const conn = await getConn();
		const dataSO = await conn.tooling.query(qy);
		const {done} = dataSO;
		if(done){
			return dataSO;
		}
	} catch (error) {
		console.error(`Error al ejecutar la consulta Tooling [${qy}]:`, error);
    throw error;
	}
};

const getWorkFlowRules = async()=>{
	const {object,fields} = require("../sObjects/WorkflowRule");
	console.time(`===================== ${object}: Data Export Start =========================`);
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
	console.log(object + ': Total Records: ' + wrfIds.length);
	console.log(object + ': Total Records Inactives: ' + recordsWfr.length);
	console.log('Data WFR: ' + JSON.stringify(recordsWfr,null,2));
	console.timeEnd(`===================== ${object}: Data Export End =========================`);
};

const getLCB = async()=>{
	const {object,fields} = require("../sObjects/LigthninhComponentBundle");
	console.time(`===================== ${object}: Data Export Start =========================`);
	const queryLh = createQuery(object,clauses.c + 'Id)');
	const lh = await sendQueryTA(queryLh);
	const {expr0} = lh.records[0];
	console.log(`${today}: controllers.getLCB: `);
	console.log(`${object}.length: ${expr0}`);

};

module.exports = {
    getWorkFlowRules,sendQueryTA,getLCB
};
