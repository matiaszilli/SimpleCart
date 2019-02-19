const { Seeder } = require('mongo-seeding');
const path = require('path');

const run = async () => {

    try {
        const databaseSettings = {
            user: 'admin',
            password: 'root',
            host: 'mongodb',
            port: 27017,
            database: 'exercise'
        };

        const connString =
            `mongodb://${databaseSettings.user}:${databaseSettings.password}@${databaseSettings.host}:${databaseSettings.port}/${databaseSettings.database}?authSource=admin`;

        const config = {
            database: connString,
            dropDatabase: true
        };

        const seeder = new Seeder(config);
        const collections = seeder.readCollectionsFromPath(path.resolve("./src/seeders/data"));

        await seeder.import(collections);

        console.log(`The seeders was ran successfully`)
    } catch (err) {
        console.log(err.message);
    }

};

module.exports = run;