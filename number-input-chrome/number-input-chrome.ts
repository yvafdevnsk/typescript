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
        numberInput.addEventListener("paste", pasteEventListener);
        numberInput.addEventListener("drop", dropEventListener);
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
 * ＊貼り付け (選択範囲有無)
 * ＊ドラッグアンドドロップ (選択範囲有無)
 * ＊サロゲートペア "𠮟" \u{20B9F}
 * ＊IME入力
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

/**
 * HTMLElement: paste event
 * 
 * @param e ClipboardEvent
 */
function pasteEventListener(e: ClipboardEvent): void {
    console.log("paste ClipboardEvent", e);
    textLog("paste Event", e);

    // paste > beforeinput > inputの順でイベントが発行される。
    // このときinputイベントのInputEvent.data(string)はnullになっている。
    // デフォルトの動作をキャンセルするとpasteイベントのみになる。
    e.preventDefault();

    // 貼り付けるデータを取得する。
    const pasteData: string | undefined = e.clipboardData?.getData("text");
    if (pasteData) {
        textLog(`paste pasteData[${pasteData}]`, e);

        // 貼り付けるデータから入力不可の文字を取り除く。
        const pasteDataAllowed: string = Array.from(pasteData)
            .filter((s) => allowMap.has(s))
            .reduce((previousValue, currentValue) => previousValue + currentValue, "");
        textLog(`paste pasteDataAllowed[${pasteDataAllowed}]`, e);
        if (pasteDataAllowed.length === 0) {
            return;
        }

        // テキストインプットのキャレットの位置に挿入する。
        //
        // selectionStart, selectionEndの型はnumber | nullとなっている。
        // if(selectionStart)では0の場合にfalseになるのでnullと比較している。
        //
        // Falsy | MDN
        // https://developer.mozilla.org/en-US/docs/Glossary/Falsy
        const inputElement: HTMLInputElement = e.target as HTMLInputElement;
        textLog(`paste selectionStart[${inputElement.selectionStart}]selectionEnd[${inputElement.selectionEnd}]`, e);
        if ((inputElement.selectionStart !== null) && (inputElement.selectionEnd !== null)) {
            // 貼り付ける前のキャレットの位置を保存する。
            const caretIndexBefore: number = inputElement.selectionStart;

            // 選択範囲ありの場合
            // 現在の選択範囲を削除したうえでキャレットの位置に挿入する。
            if (inputElement.selectionStart !== inputElement.selectionEnd) {
                inputElement.value = inputElement.value.slice(0, inputElement.selectionStart) + pasteDataAllowed + inputElement.value.slice(inputElement.selectionEnd);
            }
            // 選択範囲なしの場合
            // 現在のキャレットの位置に挿入する。
            else {
                inputElement.value = inputElement.value.slice(0, inputElement.selectionStart) + pasteDataAllowed + inputElement.value.slice(inputElement.selectionStart);
            }

            // 貼り付けたデータの後ろにキャレットの位置を移動する。
            //
            // 貼り付けたデータの文字数は文字単位で数えるためにiteratorを経由させる。
            // String.lengthはUTF-16単位で数えている。サロゲートペアはUTF-16単位では2になる。
            //
            // String length | MDN
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length#description
            inputElement.selectionStart = inputElement.selectionEnd = caretIndexBefore + [...pasteDataAllowed].length;
            textLog(`paste 終了 selectionStart[${inputElement.selectionStart}]selectionEnd[${inputElement.selectionEnd}]`, e);
        }
    }
}

/**
 * HTMLElement: drop event
 * 
 * HTML Drag and Drop API | MDN
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 * 
 * @param e DragEvent
 */
function dropEventListener(e: DragEvent): void {
    console.log("drop DragEvent", e);
    textLog("drop Event", e);

    // drop > beforeinput > inputの順でイベントが発行される。
    // このときinputイベントのInputEvent.data(string)はnullになっている。
    // デフォルトの動作をキャンセルするとpasteイベントのみになる。
    e.preventDefault();

    // ドロップするデータを取得する。
    const pasteData: string | undefined = e.dataTransfer?.getData("text");
    if (pasteData) {
        textLog(`drop pasteData[${pasteData}]`, e);

        // ドロップするデータから入力不可の文字を取り除く。
        const pasteDataAllowed: string = Array.from(pasteData)
            .filter((s) => allowMap.has(s))
            .reduce((previousValue, currentValue) => previousValue + currentValue, "");
        textLog(`drop pasteDataAllowed[${pasteDataAllowed}]`, e);
        if (pasteDataAllowed.length === 0) {
            return;
        }

        // テキストインプットのキャレットの位置に挿入する。
        //
        // selectionStart, selectionEndの型はnumber | nullとなっている。
        // if(selectionStart)では0の場合にfalseになるのでnullと比較している。
        //     Falsy | MDN
        //     https://developer.mozilla.org/en-US/docs/Glossary/Falsy
        //
        // ドロップ時のキャレットの位置をリアルタイムに取得するのは無理そう。
        // キャレットの位置と選択範囲はドラッグ操作開始前の状態になる。
        //     CaretPosition (experimental) | MDN
        //     https://developer.mozilla.org/en-US/docs/Web/API/CaretPosition
        //     Get cursor position when a file is dropped in textarea in Chrome
        //     https://stackoverflow.com/questions/65654468/get-cursor-position-when-a-file-is-dropped-in-textarea-in-chrome
        const inputElement: HTMLInputElement = e.target as HTMLInputElement;
        textLog(`drop selectionStart[${inputElement.selectionStart}]selectionEnd[${inputElement.selectionEnd}]`, e);
        if ((inputElement.selectionStart !== null) && (inputElement.selectionEnd !== null)) {
            // ドロップする前のキャレットの位置を保存する。
            // これはドラッグ操作開始前の状態になっている。
            const caretPositionBefore: number = inputElement.selectionStart;

            // 選択範囲ありの場合
            // 現在の選択範囲を削除したうえでキャレットの位置に挿入する。
            if (inputElement.selectionStart !== inputElement.selectionEnd) {
                inputElement.value = inputElement.value.slice(0, inputElement.selectionStart) + pasteDataAllowed + inputElement.value.slice(inputElement.selectionEnd);
            }
            // 選択範囲なしの場合
            // 現在のキャレットの位置に挿入する。
            else {
                inputElement.value = inputElement.value.slice(0, inputElement.selectionStart) + pasteDataAllowed + inputElement.value.slice(inputElement.selectionStart);
            }

            // ドロップしたデータの後ろにキャレットの位置を移動する。
            //
            // ドロップしたデータの文字数は文字単位で数えるためにiteratorを経由させる。
            // String.lengthはUTF-16単位で数えている。サロゲートペアはUTF-16単位では2になる。
            //     String length | MDN
            //     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length#description
            inputElement.selectionStart = inputElement.selectionEnd = caretPositionBefore + [...pasteDataAllowed].length;
            textLog(`drop 終了 selectionStart[${inputElement.selectionStart}]selectionEnd[${inputElement.selectionEnd}]`, e);
        }
    }
}
