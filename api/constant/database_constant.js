//const DATABASE_NAME = "myanmarketdb"
//const DATABASE_HOST = "myanmarketdb.cfq62mww443d.ap-southeast-2.rds.amazonaws.com";
//const DATABASE_URL = "jdbc:postgresql://myanmarketdb.cfq62mww443d.ap-southeast-2.rds.amazonaws.com:5432/myanmarketdb"
//const DATABASE_USERNAME = "MyanMarket"
//const DATABASE_PASSWORD = "MyanMarket2813"
//const DATABASE_PORT = 5432

 const DATABASE_NAME = "merchandiseprice"
 const DATABASE_HOST = "localhost";
 const DATABASE_URL = `jdbc:postgresql://localhost:5432/merchandiseprice`
 const DATABASE_USERNAME = "postgres"
 const DATABASE_PASSWORD = "root"
 const DATABASE_PORT = 5432

module.exports = {
    DATABASE_NAME,
    DATABASE_HOST,
    DATABASE_URL,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_PORT
}