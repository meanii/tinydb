import path from 'path';
import fsp from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { TinyDBModelType } from "./tinydb.type";


/**
 * @discription TinyDb instance helps to manage a local json databases, which as many instances
 * @example:
 *  const tinyDb = new Tinydb(`meanii-tinydb`)
 *  await tinydb.write([{isUser: true}])
 *
 *  @author: anilchauhanxda@gmail.com - <https://github.com/meanii>
 */
export class Tinydb {

    protected location: string = process.cwd() /* getting the current working dir */
    /**
     * init point TinyDb
     * @param database - database name, which you want to create, it is going to be enforced the system to create the file
     * weather if its already created or not
     */
    private readonly database: string
    private readonly dbPath: string
    private readonly ACTIONS = {
        query: (data: TinyDBModelType[], query: TinyDBModelType): TinyDBModelType[] => data.filter(item => item[Object.keys(query).pop()] !== Object.values(query).pop()),
        update: (data: TinyDBModelType[], query: TinyDBModelType): TinyDBModelType => data.find(item => item[Object.keys(query).pop()] === Object.values(query).pop())
    }

    constructor(database: string) {
        this.database = database
        this.dbPath = path.join(this.location, `.${this.database}.json`)
        const _ = async () => await this.init()
    }

    /**
     * this function helps to init the tinyDb to init the all processes, which is required to start before using it
     * @returns {Promise<void>}
     */
    private async init(): Promise<void> {
        await fsp.appendFile(this.dbPath, "") /* making sure, the db is exits or not */
    }

    /**
     * this function helps to get all data from the database
     * @returns {Promise<Array>}
     */
    public get(): Promise<TinyDBModelType[]> {
        return new Promise(async (resolve) => {
            try {
                const data = JSON.parse(String(await fsp.readFile(this.dbPath)))?.db ?? []
                return resolve(data)
            } catch (e) {
                return resolve([])
            }
        })
    }

    /**
     * this function helps to find an object and return it
     * @param query
     * @returns {Promise<null|*>}
     */
    public async findOne(query: TinyDBModelType): Promise<null | TinyDBModelType> {
        let data = await this.get()
        const i = data.findIndex(key => key[Object.keys(query)[0]] === Object.values(query)[0]);
        if (i > -1) return data[i];
        return null
    }

    /**
     * this function helps to delete an object and return it
     * @param query
     * @returns {Promise<null|*>}
     */
    async deleteMany<T extends TinyDBModelType>(query: T): Promise<TinyDBModelType[]> {
        let data = await this.get()
        return this.write([...this.ACTIONS.query(data, query)])
    }

    /**
     * this function helps to append data, to the db
     * @param data TinydbType
     * @returns {Promise<void>}
     */
    public async insertOne<T extends TinyDBModelType>(data: T): Promise<T> {
        if (!data?._id) data._id = uuidv4()
        const content = await this.get()
        if (content.find(item => item._id === data._id)) throw new Error(`Primary key should be unique!`)
        content.push({ ...data, createdAt: new Date(), updatedAt: new Date() } as never)
        await this.write(content)
        return data
    }

    /**
     * this function helps to upsert the object
     * @param query
     * @param object
     * @returns {Promise<void>}
     */
    public async findOneAndUpdate(query: TinyDBModelType, object: TinyDBModelType): Promise<TinyDBModelType> {
        let data = await this.get()
        if (!this.ACTIONS.update(data, query)) return data
        await this.write([...this.ACTIONS.query(data, query), { ...this.ACTIONS.update(data, query), ...object, updatedAt: new Date() }])
        return this.ACTIONS.update(data, query)
    }

    /**
     *this functions help to rewrite all data
     * @param object
     * @returns {Promise<void>}
     */
    private async write<T extends TinyDBModelType>(object: TinyDBModelType[]): Promise<TinyDBModelType[]> {
        await fsp.writeFile(this.dbPath, JSON.stringify({ db: object }, null, "\t"))
        return await this.get()
    }

    /**
     * this functions delete everything, which they have stored
     * @returns {Promise<void>}
     */
    public async purgeAll(): Promise<void> {
        await fsp.unlink(this.dbPath)
    }
}
