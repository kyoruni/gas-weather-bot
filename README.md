# GAS-WEATHER-BOT

- 明日の天気を通知してくれるSlack bot

  - Google Apps Script

  - Incoming Webhook

  - Livedoor Weather Hacks API

![お天気くん](https://user-images.githubusercontent.com/40832190/80591195-38079e80-8a58-11ea-9154-e0bbd98667ea.png)

## 導入方法

- ワークスペースの `設定と管理` → `アプリを管理する`

- Appディレクトリで **webhook** と検索 → `Incoming Webhook` を選択

- `Slackに追加` をクリック

- 設定メニューの `チャンネルへの投稿` で、投稿させたいチャンネルを選択

- 設定メニューの `名前をカスタマイズ` で、任意の bot 名を設定

- **webhook URL** を控えておく

- Google ドライブで `新規作成` → `その他` → `Google Apps Script`

- **bot.gs** のコードを貼り付ける

  - 地域コードを自分の地域に合わせて書き換え

    - 横浜市なら **140010**

    - 他の地域のコードは、 [1次細分区定義表 - livedoor 天気情報](http://weather.livedoor.com/forecast/rss/primary_area.xml) 

  - webhook URL を、先ほど控えたURLに差し替え

- **時計マークのアイコン** をクリック、 トリガー一覧の画面へ → `トリガーを追加`

- 下記の通り設定して導入完了

  - 実行する関数を選択 → main
  
  - 実行するデプロイを選択 → Head
  
  - イベントのソースを選択 → 時間手動型
  
  - 時間ベースのトリガーのタイプを選択 → 時間ベースのタイマー 任意の時間を選択
