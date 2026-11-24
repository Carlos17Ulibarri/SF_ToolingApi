const {getConn} = require("../connection");

const clauses = {
	s:'SELECT ',
	f:' FROM ',
	w:' WHERE ',
	o:' ORDER BY ',
	l:' LIMIT ',
	nI:' NOT IN ',
	c:'COUNT('
};

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

module.exports = {
    clauses,createQuery,sendQueryTA
};