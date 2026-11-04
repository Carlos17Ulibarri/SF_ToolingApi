const jsforce = require("jsforce");
require('dotenv').config();
const {orgSf,userSf} = require('./client');

const today = new Date();

const conn = new jsforce.Connection({loginUrl: orgSf.loginUrl});
const getConn = async()=>{
		if (conn.accessToken) {
			return conn;
  	}
    try {
        const loginInfo = await conn.login(userSf.name,userSf.pwd);
				const {organizationId} = loginInfo;
				const validateConnection = organizationId.includes(orgSf.Id);

				if(validateConnection){
					console.log(`${today}: connection.getConn: `);
					console.log("****** Successfully logged in Salesforce ORG ******");
					console.log('===================== Data ORG =========================');
					console.log('Result Connection SF: ' + JSON.stringify(loginInfo,null,2));
					console.log('========================================================');
				}
				return conn;
    } catch (error) {
        console.error("Failed to log in to Salesforce: ", error);
    }
};

//conn.query = promisify(conn.query);
module.exports = {
    getConn
};