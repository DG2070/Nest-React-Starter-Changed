import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { dataSourceOptions } from '../data-source-initialization';

const seedingDataSourceoOptions: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  seeds: ['dist/database/seeding/main.seeder.js'],
};

const seederDataSource = new DataSource(seedingDataSourceoOptions);
seederDataSource.initialize().then(async () => {
  await runSeeders(seederDataSource);
  process.exit();
});

export default seederDataSource;
