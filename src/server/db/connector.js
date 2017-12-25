import { MongoClient, Logger } from 'mongodb';
import chalk from 'chalk';

module.exports = (url, collections) => {
  if (!collections.push) collections = [collections];

  const splitUrl = url.split('/');
  const dbName = splitUrl[splitUrl.length - 1];

  return MongoClient.connect(url).then((database) => {
    Logger.setCurrentLogger((msg, state) => {
      console.log(`${chalk.bgYellow.bold('[MONGODB]:')} ${msg}`);
    });
    Logger.setLevel('debug');

    Logger.filter('class', ['Cursor']);

    const emptyObj = {};

    collections.map((item) => {
      emptyObj[item] = database.db(dbName).collection(item);
    });

    emptyObj.database = database.db(dbName);

    return emptyObj;
  });
};
