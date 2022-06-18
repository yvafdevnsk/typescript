class ListItem {
    public key1: string = "";
    public key2: string = "";
    public key3: string = "";
    public value: string = "";

    constructor(key1: string, key2: string, key3: string, value: string) {
        this.key1 = key1;
        this.key2 = key2;
        this.key3 = key3;
        this.value = value;
    }
}

function makeList(): ListItem[] {
    const list: ListItem[] = [];
    list.push(new ListItem("a", "b", "c", "value-0-a-b-c"));
    list.push(new ListItem("d", "e", "f", "value-1-d-e-f"));
    list.push(new ListItem("g", "h", "i", "value-2-g-h-i"));
    return list;
}

function array2map(): void {
    const myList: ListItem[] = makeList();
    const myMap: Map<string, ListItem> = new Map();

    // 配列からマップを作成する。
    myList.forEach((item) => {
        const mapKey: string = [item.key1, item.key2, item.key3].join("-");
        myMap.set(mapKey, item);
    });

    // 画面から入力された配列のインデックスを取得する。
    let index: number = -1;
    const input: HTMLInputElement | null = document.getElementById("listIndex") as HTMLInputElement;
    if (input !== null) {
        index = (input.value === "") ? -1 : Number(input.value);
    }

    // 指定されたインデックスの要素から検索キーを作成してマップから値を取得する。
    let searchKey: string = "";
    if ((0 <= index) && (index < myList.length)) {
        searchKey = [myList[index].key1, myList[index].key2, myList[index].key3].join("-");
    }
    const resultValue: string | undefined = myMap.get(searchKey)?.value;

    // 取得した値を画面に出力する。
    const output: HTMLElement | null = document.getElementById("debug");
    if (output !== null) {
        output.textContent = (resultValue === undefined) ? "not found" : resultValue;
    }
}