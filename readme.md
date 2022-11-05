
# tinydb 💫

tinydb is json database, which you can use for as local non-sql database.

## installtion
```bash
yarn add @meanii/tinydb
```

## How to init it?

```javascript
import { Tinydb } from "@meanii/tinydb";

const db = new Tinydb(`touka.ssh`);
```

```javascript
class ToukaStorage extends Tinydb {
    constructor() {
        super(`touka.ssh`)
    }
}

const db = new ToukaStorage()
```

## methods

### insertOne

```javascript
await db.insertOne({username: `meanii`})
```

### findOne

```javascript
const data = await db.findOne({username: `meanii`})
console.log(data)
```
```javascript
{
  username: 'meanii',
  uuid: 'd95f3826-f82a-4944-9d56-df28740009f0',
  createdAt: '2022-11-05T11:12:05.196Z',
  updatedAt: '2022-11-05T11:12:05.196Z'
}
```


### deleteMany

```javascript
await db.deleteMany({ username: `meanii` })
```

### findOneAndUpdate

```javascript
await db.findOneAndUpdate({ username: `meanii` }, { status: `updated` })
```
---

### Copyright & License

- Copyright (C)  2022 [anil chauhan](https://github.com/meanii )
- Licensed under the terms of
the [MIT License](https://github.com/meanii/tinydb/blame/main/LICENSE)