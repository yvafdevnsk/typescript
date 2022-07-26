# TypeScript サンプルコード

## array-to-map
配列からマップを作成する。
```
const myList: ListItem[] = makeList();
const myMap: Map<string, ListItem> = new Map();

myList.forEach((item) => {
    const mapKey: string = [item.key1, item.key2, item.key3].join("-");
    myMap.set(mapKey, item);
});
```
ビルドする。
```
$ npx tsc --target es2015 array-to-map.ts
```
