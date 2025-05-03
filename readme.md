// migration script
npx sequelize-cli db:migrate
// production
npx sequelize-cli db:migrate --env production
// after migration
npm start
// undo 
npx sequelize-cli db:migrate:undo