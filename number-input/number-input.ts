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
    }

    const button: HTMLElement | null = document.getElementById("clear");
    if (button !== null) {
        button.addEventListener("click", clearLog);
    }
}

/**
 * HTMLElement: beforeinput event
 * 
 * @param e InputEvent
 */
function beforeinputEventListener(e: InputEvent): void {
    textLog("\n**********");
    textLog(`beforeinput data[${e.data}] inputType[${e.inputType}] isComposing[${e.isComposing}] dataTransfer[${e.dataTransfer}]`);
    if (e.target !== null) {
        textLog(`beforeinput 既存の入力値 e.target.value[${(e.target as HTMLInputElement).value}]`);
    }

    if ((e.data !== null) && (e.data.length > 0)) {
        const allow: string[] = ["1","2","3","4","5","6","7","8","9","0"];
        if (allow.indexOf(e.data) === -1) {
            textLog("beforeinput 入力値あり cancel");
            e.preventDefault();
        }
        else {
            textLog("beforeinput 入力値あり ok");
        }
    }
    else {
        textLog("beforeinput 入力値なし");
    }
}

/**
 * HTMLElement: input event
 * 
 * @param e InputEvent
 */
function inputEventListener(e: InputEvent | Event): void {
    if (e instanceof InputEvent) {
        textLog(`input InputEvent data[${e.data}] inputType[${e.inputType}] isComposing[${e.isComposing}] dataTransfer[${e.dataTransfer}]`);
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
