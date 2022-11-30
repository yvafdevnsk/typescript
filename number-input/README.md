# 数字入力テキストインプット (Windows10のFirefox107で動作する)

## 仕様
数字 1,2,3,4,5,6,7,8,9,0 のみ入力可能なテキストインプット

## 注意
- FirefoxではIME入力の確定をinputイベントで処理する。
- Firefoxでは貼り付けもinputイベントで処理できる。

## ビルド
```
$ npx tsc --target es2015 number-input.ts
```
