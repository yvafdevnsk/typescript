const load: any = () => {
    init();
};
window.onload = load;

/**
 * ログの型。
 */
interface Log {
    text: string;
    event: InputEvent | CompositionEvent | Event;
}
/**
 * ログのリスト。
 */
const logList: Log[] = [];

/**
 * 入力可能とする文字の集合。
 */
const allowMap: Map<string, string> = new Map([
    ["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],
    ["6","6"],["7","7"],["8","8"],["9","9"],["0","0"],
    ["\u{20B9F}","\u{20B9F}"] //サロゲートペア "𠮟"
]);

/**
 * テキストエリアのログをクリアする。
 */
function clearLog(): void {
    const log: HTMLElement | null = document.getElementById("log");
    if (log !== null) {
        (log as HTMLTextAreaElement).value = "";
    }
    logList.splice(0, logList.length);
}

/**
 * テキストエリアにログを出力する。
 * 
 * @param text ログに出力する文字列
 * @param event ログに出力するイベント
 */
function textLog(text: string, event: InputEvent | CompositionEvent | Event): void {
    const log: HTMLElement | null = document.getElementById("log");
    if (log !== null) {
        logList.push({ text, event });
        logList.sort((a: Log, b: Log): number => a.event.timeStamp - b.event.timeStamp);

        let logText: string = "";
        logList.forEach((log) => logText += "\n" + "[" + log.event.timeStamp + "]" + log.text);

        const textArea: HTMLTextAreaElement = log as HTMLTextAreaElement;
        textArea.value = logText;
        setTimeout(() => {
            textArea.scrollTo(0, textArea.scrollHeight);
        }, 0);
    }
}

/**
 * イベントリスナーの登録。
 */
function init(): void {
    const numberInput: HTMLElement | null = document.getElementById("number-input");
    if (numberInput !== null) {
        numberInput.addEventListener("beforeinput", beforeinputEventListener);
        numberInput.addEventListener("input", inputEventListener);
        numberInput.addEventListener("change", changeEventListener);
        numberInput.addEventListener("compositionstart", compositionStartEventListener);
        numberInput.addEventListener("compositionupdate", compositionUpdateEventListener);
        numberInput.addEventListener("compositionend", compositionEndEventListener);
    }

    const button: HTMLElement | null = document.getElementById("clear");
    if (button !== null) {
        button.addEventListener("click", clearLog);
    }
}

/**
 * HTMLElement: beforeinput event
 * 
 * ＊直接入力
 * ＊貼り付け
 * ＊ドラッグアンドドロップ
 * ＊サロゲートペア "𠮟" \u{20B9F}
 * ＊IME
 * 
 * @param e InputEvent
 */
function beforeinputEventListener(e: InputEvent): void {
    textLog("******************************", e);
    textLog(`beforeinput data[${e.data}] inputType[${e.inputType}] isComposing[${e.isComposing}] dataTransfer[${e.dataTransfer}]`, e);

    if (e.isComposing) {
        textLog("beforeinput now composing, nothing to do", e);
        return;
    }

    if (e.target !== null) {
        textLog(`beforeinput 既存の入力値 e.target.value[${(e.target as HTMLInputElement).value}]`, e);
    }

    if ((e.data !== null) && (e.data.length > 0)) {
        textLog("beforeinput 入力値.length=" + e.data.length, e);
        textLog("beforeinput Array.from(入力値).length=" + Array.from(e.data).length, e);

        const dataList: string[] = Array.from(e.data);
        if (dataList.every((s) => allowMap.has(s))) {
            textLog("beforeinput 入力値あり 全文字 ok", e);
        }
        else if (dataList.some((s) => allowMap.has(s))) {
            textLog("beforeinput 入力値あり 何れかの文字 ng", e);
            // inputイベントでNGの文字を取り除く。
        }
        else {
            textLog("beforeinput 入力値あり 全文字 ng", e);
            e.preventDefault();
        }
    }
    else {
        textLog("beforeinput 入力値なし", e);
    }
}

/**
 * HTMLElement: input event
 * キャンセル不可。
 * 
 * @param e InputEvent
 */
function inputEventListener(e: InputEvent | Event): void {
    if (e instanceof InputEvent) {
        textLog(`input InputEvent data[${e.data}] inputType[${e.inputType}] isComposing[${e.isComposing}] dataTransfer[${e.dataTransfer}]`, e);

        if (e.isComposing) {
            textLog("input now composing, nothing to do", e);
            return;
        }

        if ((e.data !== null) && (e.data.length > 0)) {
            textLog("input 入力値.length=" + e.data.length, e);
            textLog("input Array.from(入力値).length=" + Array.from(e.data).length, e);
    
            const dataList: string[] = Array.from(e.data);
            if (dataList.every((s) => allowMap.has(s))) {
                textLog("input 入力値あり 全文字 ok", e);
            }
            else {
                textLog("input 入力値あり 何れかの文字 ng", e);

                // inputイベントはキャンセルできないので
                // テキストインプットの内容から入力不可の文字を取り除く。

                // IMEで入力された場合はinputイベントがe.isComposing=trueで呼ばれた後にcompositionendイベントが呼ばれる。
                // IMEで入力された場合はbeforeinputイベントの処理はe.isComposing=trueになるのでスキップされる。
                // IMEで入力された場合はinputイベントの処理はe.isComposing=trueになるのでスキップされる。
                // IMEで入力された場合はcompositionendイベントで入力不可の文字を取り除く。
                const inputElement: HTMLInputElement = e.target as HTMLInputElement;
                inputElement.value = Array.from(inputElement.value)
                    .filter((s) => allowMap.has(s))
                    .reduce((previousValue, currentValue) => previousValue + currentValue, "");
            }
        }
        else {
            textLog("input 入力値なし", e);
        }
    }
    else {
        textLog("input Event", e);
    }
}

/**
 * HTMLElement: change event
 * 
 * @param e Event
 */
function changeEventListener(e: Event): void {
    textLog("change Event", e);
}

/**
 * HTMLElement: compositionstart event
 * 
 * @param e CompositionEvent
 */
function compositionStartEventListener(e: CompositionEvent): void {
    textLog(`compositionstart Event data[${e.data}]`, e);
    e.preventDefault();
}

/**
 * HTMLElement: compositionupdate event
 * 
 * @param e CompositionEvent
 */
function compositionUpdateEventListener(e: CompositionEvent): void {
    textLog(`compositionupdate Event data[${e.data}]`, e);
}

/**
 * HTMLElement: compositionend event
 * 
 * @param e CompositionEvent
 */
function compositionEndEventListener(e: CompositionEvent): void {
    textLog(`compositionend Event data[${e.data}]`, e);

    if ((e.data !== null) && (e.data.length > 0)) {
        textLog("compositionend 入力値.length=" + e.data.length, e);
        textLog("compositionend Array.from(入力値).length=" + Array.from(e.data).length, e);

        const dataList: string[] = Array.from(e.data);
        if (dataList.every((s) => allowMap.has(s))) {
            textLog("compositionend 入力値あり 全文字 ok", e);
        }
        else {
            textLog("compositionend 入力値あり 何れかの文字 ng", e);

            // IMEで入力された場合はinputイベントがe.isComposing=trueで呼ばれた後にcompositionendイベントが呼ばれる。
            // IMEで入力された場合はbeforeinputイベントの処理はe.isComposing=trueになるのでスキップされる。
            // IMEで入力された場合はinputイベントの処理はe.isComposing=trueになるのでスキップされる。
            // IMEで入力された場合はcompositionendイベントで入力不可の文字を取り除く。
            const inputElement: HTMLInputElement = e.target as HTMLInputElement;
            inputElement.value = Array.from(inputElement.value)
                .filter((s) => allowMap.has(s))
                .reduce((previousValue, currentValue) => previousValue + currentValue, "");
        }
    }
}
