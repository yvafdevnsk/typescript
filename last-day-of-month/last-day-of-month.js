const load = () => {
    init();
};
window.onload = load;
/**
 * イベントリスナーの登録。
 */
function init() {
    const showLastDayOfMonthButton = document.getElementById("show-last-day-of-month-button");
    showLastDayOfMonthButton.addEventListener("click", showLastDayOfMonthButtonClickEventListener);
}
/**
 * 月末日を出力する。
 *
 * @param e MouseEvent
 */
function showLastDayOfMonthButtonClickEventListener(e) {
    // 2023年n月の月末日を取得する。
    //
    // Date.setFullYear()を使う。
    //
    // const d: Date = new Date();
    // d.setFullYear(2023, n, 0);
    //
    // 月と日の指定を翌月の0日とすることで月末日を取得できる。
    // month => n (月は0からなので翌月の指定になる)
    // day   => 0 (日付を0にすると前月の月末日になる)
    const dateList = [];
    let d = new Date();
    // 2023年1月の月末日
    d = new Date();
    d.setFullYear(2023, 1, 0);
    dateList.push(d);
    // 2023年2月の月末日
    d = new Date();
    d.setFullYear(2023, 2, 0);
    dateList.push(d);
    // 2023年3月の月末日
    d = new Date();
    d.setFullYear(2023, 3, 0);
    dateList.push(d);
    // 2023年4月の月末日
    d = new Date();
    d.setFullYear(2023, 4, 0);
    dateList.push(d);
    // 2023年5月の月末日
    d = new Date();
    d.setFullYear(2023, 5, 0);
    dateList.push(d);
    // 2023年6月の月末日
    d = new Date();
    d.setFullYear(2023, 6, 0);
    dateList.push(d);
    // 2023年7月の月末日
    d = new Date();
    d.setFullYear(2023, 7, 0);
    dateList.push(d);
    // 2023年8月の月末日
    d = new Date();
    d.setFullYear(2023, 8, 0);
    dateList.push(d);
    // 2023年9月の月末日
    d = new Date();
    d.setFullYear(2023, 9, 0);
    dateList.push(d);
    // 2023年10月の月末日
    d = new Date();
    d.setFullYear(2023, 10, 0);
    dateList.push(d);
    // 2023年11月の月末日
    d = new Date();
    d.setFullYear(2023, 11, 0);
    dateList.push(d);
    // 2023年12月の月末日
    d = new Date();
    d.setFullYear(2023, 12, 0);
    dateList.push(d);
    const outputString = dateList
        .map((d) => {
        return d.toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
    })
        .join("\r\n");
    // うるう年の2月の月末日を取得する。
    // うるう年の場合は月末日が29日になることを確認する。
    const leapYearDateList = [];
    // 2024年2月の月末日
    d = new Date();
    d.setFullYear(2024, 2, 0);
    leapYearDateList.push(d);
    // 2028年2月の月末日
    d = new Date();
    d.setFullYear(2028, 2, 0);
    leapYearDateList.push(d);
    const leapYearOutputString = leapYearDateList
        .map((d) => {
        return d.toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
    })
        .join("\r\n");
    // 月末日を出力する。
    const logTextarea = document.getElementById("log-textarea");
    logTextarea.textContent = [
        "平年",
        outputString,
        "うるう年",
        leapYearOutputString
    ].join("\r\n");
}
