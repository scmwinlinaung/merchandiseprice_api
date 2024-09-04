const { Liquibase, POSTGRESQL_DEFAULT_CONFIG } = require( 'liquibase' );
const { DATABASE_USERNAME, DATABASE_URL, DATABASE_PASSWORD } = require( '../constant/database_constant' );

const liquibaseConfig = {
    ...POSTGRESQL_DEFAULT_CONFIG,
    changeLogFile: 'changelog.xml',
    url: DATABASE_URL,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
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
