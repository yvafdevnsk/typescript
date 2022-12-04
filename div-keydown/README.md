# div要素でkeydownイベントを受け取る

## 仕様
div要素にtabindex=-1を設定してkeydownイベントを受け取る。

## 注意
- Chromeではkeydownイベントを受け取ると輪郭線(outline)が表示される。

## ビルド
```
$ npx tsc --target es2015 div-keydown.ts
```
