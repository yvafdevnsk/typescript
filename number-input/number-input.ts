const load: any = () => {
    init();
};
window.onload = load;

/**
 * テキストエリアのログをクリアする。
 */
function clearLog(): void {
    const log: HTMLElement | null = document.getElementById("log");
    if (log !== null) {
        (log as HTMLTextAreaElement).value = "";
    }
}

/**
 * テキストエリアにログを出力する。
 * 
 * @param text ログに出力する文字列
 */
function textLog(text: string): void {
    const log: HTMLElement | null = document.getElementById("log");
    if (log !== null) {
        const textArea: HTMLTextAreaElement = log as HTMLTextAreaElement;
        textArea.value += "\n" + text;
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
 * IME
 * 
 * @param e InputEvent
 */
function beforeinputEventListener(e: InputEvent): void {
    textLog("\n**********");
    textLog(`beforeinput data[${e.data}] inputType[${e.inputType}] isComposing[${e.isComposing}] dataTransfer[${e.dataTransfer}]`);

    if (e.isComposing) {
        textLog("beforeinput now composing, nothing to do");
        return;
    }

    if (e.target !== null) {
        textLog(`beforeinput 既存の入力値 e.target.value[${(e.target as HTMLInputElement).value}]`);
    }

    if ((e.data !== null) && (e.data.length > 0)) {
        textLog("beforeinput 入力値.length=" + e.data.length);
        textLog("beforeinput Array.from(入力値).length=" + Array.from(e.data).length);

        const allow: Map<string, string> = new Map([
            ["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],
            ["6","6"],["7","7"],["8","8"],["9","9"],["0","0"],
            ["\u{20B9F}","\u{20B9F}"] //サロゲートペア "𠮟"
        ]);
        if (Array.from(e.data).every((s) => allow.has(s))) {
            textLog("beforeinput 入力値あり 全要素 ok");
        }
        else {
            textLog("beforeinput 入力値あり cancel");
            e.preventDefault();
        }
    }
    else {
        textLog("beforeinput 入力値なし");
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
        textLog(`input InputEvent data[${e.data}] inputType[${e.inputType}] isComposing[${e.isComposing}] dataTransfer[${e.dataTransfer}]`);

        if (e.isComposing) {
            textLog("input now composing, nothing to do");
            return;
        }

        if ((e.data !== null) && (e.data.length > 0)) {
            textLog("input 入力値.length=" + e.data.length);
            textLog("input Array.from(入力値).length=" + Array.from(e.data).length);
    
            const allow: Map<string, string> = new Map([
                ["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],
                ["6","6"],["7","7"],["8","8"],["9","9"],["0","0"],
                ["\u{20B9F}","\u{20B9F}"] //サロゲートペア "𠮟"
            ]);
            if (Array.from(e.data).every((s) => allow.has(s))) {
                textLog("input 入力値あり 全要素 ok");
            }
            else {
                textLog("input 入力値あり cancel");

                // IMEで入力された場合はcompositionendイベントの後にinputイベントが呼ばれる。
                // beforeinputイベントの呼び出しはcomposing中になるのでスキップされる。
                // IMEで入力された場合はinputイベントでも入力不可の文字列を取り除く。
                const inputElement: HTMLInputElement = e.target as HTMLInputElement;
                inputElement.value = Array.from(inputElement.value)
                .filter((s) => allow.has(s))
                .reduce((previousValue, currentValue) => previousValue + currentValue, "");
            }
        }
        else {
            textLog("beforeinput 入力値なし");
        }
    }
    else {
        textLog("input Event");
    }
}

/**
 * HTMLElement: change event
 * 
 * @param e Event
 */
function changeEventListener(e: Event): void {
    textLog("change Event");
}

/**
 * HTMLElement: compositionstart event
 * 
 * @param e CompositionEvent
 */
function compositionStartEventListener(e: CompositionEvent): void {
    textLog(`compositionstart Event data[${e.data}]`);
    e.preventDefault();
}

/**
 * HTMLElement: compositionupdate event
 * 
 * @param e CompositionEvent
 */
function compositionUpdateEventListener(e: CompositionEvent): void {
    textLog(`compositionupdate Event data[${e.data}]`);
}

/**
 * HTMLElement: compositionend event
 * 
 * @param e CompositionEvent
 */
function compositionEndEventListener(e: CompositionEvent): void {
    textLog(`compositionend Event data[${e.data}]`);
}
