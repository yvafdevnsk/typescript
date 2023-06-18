# 月末日を取得する

## 仕様
- Date.setFullYear()を使う。
- 翌月の0日を指定すると当月の月末日を取得できる。
- うるう年の場合は2月の月末日は29日になる。

## サンプルコード
```
// 2023年1月の月末日
const d: Date = new Date();
d.setFullYear(2023, 1, 0);

const outputString: string = d.toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
console.log("2023年1月の月末日", outputString); => 2023/01/31
```

## ビルド
```
$ npx tsc --target es2015 last-day-of-month.ts
```
