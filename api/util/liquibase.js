const { Liquibase, POSTGRESQL_DEFAULT_CONFIG } = require( 'liquibase' );

const databaseName = 'merchandiseprice';
const liquibaseConfig = {
    ...POSTGRESQL_DEFAULT_CONFIG,
    changeLogFile: 'changelog.xml',
    url: `jdbc:postgresql://localhost:5432/${ databaseName }`,
    username: 'postgres',
    password: 'root',
    driver: 'org.postgresql.Driver',
    classpath: './lib/postgresql-42.7.3.jar',
    logLevel: 'debug', // Optional: set log level
};

// Initialize Liquibase instance
const liquibase = new Liquibase( liquibaseConfig );

const updateLiquibase = async () =>
{
    try
    {
        // Run the update command
        await liquibase
            .run( 'update' )
        console.log( 'Liquibase update executed successfully.' );
    } catch ( err )
    {
        console.error( 'Error executing Liquibase update:', err );
    }

}

module.exports = { updateLiquibase }
