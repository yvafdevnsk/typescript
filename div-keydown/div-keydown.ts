const load: any = () => {
    init();
};
window.onload = load;

/**
 * イベントリスナーの登録。
 */
function init(): void {
    const setFocusButton: HTMLElement | null = document.getElementById("set-focus-button");
    if (setFocusButton !== null) {
        setFocusButton.addEventListener("click", setFocusButtonClickEventListener);
    }

    const keydownDiv: HTMLElement | null = document.getElementById("div-keydown");
    if (keydownDiv !== null) {
        keydownDiv.addEventListener("keydown", keydownDivKeydownEventListener);
        keydownDiv.addEventListener("focusin", keydownDivFocusInEventListener);
        keydownDiv.addEventListener("focusout", keydownDivFocusOutEventListener);
    }
}

/**
 * div要素にフォーカスを設定する。
 * 
 * @param e MouseEvent
 */
function setFocusButtonClickEventListener(e: MouseEvent): void {
    const keydownDiv: HTMLElement | null = document.getElementById("div-keydown");

    // setTimeout()しないとfocusin > focusout > focusinと3回イベントが発生する。
    setTimeout(() => {
        keydownDiv?.focus();
    }, 0);
}

/**
 * div要素でkeydownイベントが発生した。
 * 
 * @param e KeyboardEvent
 */
function keydownDivKeydownEventListener(e: KeyboardEvent): void {
    console.log("keydownDivKeydownEventListener e", e);
}

/**
 * div要素でfocusinイベントが発生した。
 * 
 * @param e FocusEvent
 */
function keydownDivFocusInEventListener(e: FocusEvent): void {
    console.log("keydownDivFocusInEventListener e", e);

    const focusLog: HTMLElement | null = document.getElementById("focus-log");
    if (focusLog) {
        focusLog.textContent = "focus in";
    }
}

/**
 * div要素でfocusoutイベントが発生した。
 * 
 * @param e FocusEvent
 */
function keydownDivFocusOutEventListener(e: FocusEvent): void {
    console.log("keydownDivFocusOutEventListener e", e);

    const focusLog: HTMLElement | null = document.getElementById("focus-log");
    if (focusLog) {
        focusLog.textContent = "focus out";
    }
}
