class ListItem {
    constructor(key1, key2, key3, value) {
        this.key1 = "";
        this.key2 = "";
        this.key3 = "";
        this.value = "";
        this.key1 = key1;
        this.key2 = key2;
        this.key3 = key3;
        this.value = value;
    }
}
function makeList() {
    const list = [];
    list.push(new ListItem("a", "b", "c", "value-0-a-b-c"));
    list.push(new ListItem("d", "e", "f", "value-1-d-e-f"));
    list.push(new ListItem("g", "h", "i", "value-2-g-h-i"));
    return list;
}
function array2map() {
    var _a;
    const myList = makeList();
    const myMap = new Map();
    // 配列からマップを作成する。
    myList.forEach((item) => {
        const mapKey = [item.key1, item.key2, item.key3].join("-");
        myMap.set(mapKey, item);
    });
    // 画面から入力された配列のインデックスを取得する。
    let index = -1;
    const input = document.getElementById("listIndex");
    if (input !== null) {
        index = (input.value === "") ? -1 : Number(input.value);
    }
    // 指定されたインデックスの要素から検索キーを作成してマップから値を取得する。
    let searchKey = "";
    if ((0 <= index) && (index < myList.length)) {
        searchKey = [myList[index].key1, myList[index].key2, myList[index].key3].join("-");
    }
    const resultValue = (_a = myMap.get(searchKey)) === null || _a === void 0 ? void 0 : _a.value;
    // 取得した値を画面に出力する。
    const output = document.getElementById("debug");
    if (output !== null) {
        output.textContent = (resultValue === undefined) ? "not found" : resultValue;
    }
}
