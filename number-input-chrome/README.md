# 数字入力テキストインプット (Windows10のChrome107で動作する)

## 仕様
数字 1,2,3,4,5,6,7,8,9,0 のみ入力可能なテキストインプット

## 注意
ChromeではIME入力の確定をcompositionendイベントで処理する。

## ビルド
```
$ npx tsc --target es2015 number-input-chrome.ts
```
