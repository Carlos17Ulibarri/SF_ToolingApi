require ('dotenv').config();

const {
    SFUSER,SFPWD,SFST,SFPROTOCOL,SFDOMAIN,IDPROD
} = process.env;

const orgSf = {
	loginUrl:SFPROTOCOL + '://' + SFDOMAIN,
	Id:IDPROD
};

const userSf = {
	name:SFUSER,
	pwd:SFPWD + SFST
};

module.exports = {
    orgSf,userSf
};

