// migration script
npx sequelize-cli db:migrate
// after migration
npm start
// undo 
npx sequelize-cli db:migrate:undo