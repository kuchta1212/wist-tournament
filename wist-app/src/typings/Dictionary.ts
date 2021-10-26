export interface IDictionary<TValue> {
    get(key: string): TValue;
    put(key: string, value: TValue): void;
    remove(key: string): void;
    getKeys(): string[];
    getValues(): TValue[];
    contains(key: string): boolean;

}

interface IHashMap<TValue> {
    [key: string]: TValue
}

export class Dictionary<TValue> implements IDictionary<TValue>{

    private hashMap: IHashMap<TValue>;

    constructor() {
        this.hashMap = {} as IHashMap<TValue>;
    }

    get(key: string): TValue {
        return this.hashMap[key];
    }

    put(key: string, value: TValue): void {
        this.hashMap[key] = value;
    }

    remove(key: string): void {
        delete this.hashMap[key];
    }

    getKeys(): string[] {
        return Object.keys(this.hashMap);
    }

    getValues(): TValue[] {
        let values = Object.keys(this.hashMap).map((key) => {
            return this.hashMap[key];
        });
        return values;
    }

    contains(key: string): boolean {
        let value = this.get(key);
        return !!value;
    }

    static convert<TValue>(object: any): IDictionary<TValue> {

        let dict = new Dictionary<TValue>();
        Object.keys(object).map((userId) => {
            dict.put(userId, object[userId] as TValue)
        })

        return dict;
    }

}