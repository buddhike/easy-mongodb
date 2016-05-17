import _ from 'lodash';
import {MongoClient} from 'mongodb';

import ensure from 'easy-ensure';

function defineCollectionMember(collection, name, implementation) {
  if (typeof collection[name] !== 'undefined') {
    throw new Error(`member - ${name} already exists`);
  }

  collection[name] = implementation;
}

export default class Db {

  constructor(url) {
    this.url = url;
  }

  async set(name) {
    ensure(_.isString(name), 'name must be a string');

    if (!this._db) {
      this._db = await MongoClient.connect(this.url);
    }

    const set = this._db.collection(name);

    defineCollectionMember(set, 'findOrInsert', async (query, doc) => {
      let item = await set.findOne(query);
      if (item) {
        return item;
      }

      item = await set.insert(doc);

      return doc;
    });

    return set;
  }

  dispose() {
    if (this._db) {
      console.log('disposed', this.url); // eslint-disable-line
      this._db.close();
    }
  }
}
