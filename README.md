# 祝日対応 万年カレンダー

日本の祝日・休日に対応した、フレームワーク不使用の万年カレンダーです。

HTML / CSS / JavaScript のみで作成しており、`index.html` をブラウザで開くだけで利用できます。

## ユーザ向け

### できること

- 年月を選択してカレンダーを表示できます。
- 前月 / 翌月、前年 / 翌年へ移動できます。
- 「今日」ボタンで現在年月へ戻れます。
- 土曜、日曜、祝日、今日を色分けして表示します。
- 選択中の月に含まれる祝日・休日を一覧表示します。
- 内閣府の祝日データをもとに祝日を反映します。

### 使い方

1. `index.html` をブラウザで開きます。
2. 年と月を選択します。
3. カレンダーと祝日一覧を確認します。

直接開くファイル:

```text
index.html
```

### 祝日データについて

祝日表示には `data/holidays.js` を使用します。

このファイルは内閣府の祝日CSVから生成されているため、`index.html` を直接ブラウザで開いた場合でも祝日が反映されます。

### 祝日データを更新する場合

次のコマンドを実行すると、内閣府のCSVを取得し、以下の2ファイルを更新します。

- `data/syukujitsu.csv`
- `data/holidays.js`

```powershell
node .\update-holidays.js
```

1か月に1回、自動で取得し続ける場合:

```powershell
node .\update-holidays.js --watch
```

### GitHub上で自動更新する場合

GitHub Actionsにより、毎月1回、内閣府のCSVを取得して祝日データを更新します。

更新対象:

- `data/syukujitsu.csv`
- `data/holidays.js`

差分がある場合のみ、次のコミットメッセージで自動コミットされます。

```text
chore: 祝日データを更新
```

GitHubのActions画面から、手動で実行することもできます。

## 開発者向け

### 技術構成

- HTML
- CSS
- JavaScript
- Node.js
- フレームワークなし

ブラウザ側のJavaScriptは、クラスごとに分割しています。

Node.js側の祝日更新処理も、アプリケーション、サービス、スケジューラ、設定に分けています。

### ディレクトリ構成

```text
calendar/
  index.html
  styles.css
  script.js
  update-holidays.js
  data/
    syukujitsu.csv
    holidays.js
  .github/
    workflows/
      update-holidays.yml
  scripts/
    calendar/
      config/
        calendarConfig.js
      controllers/
        CalendarController.js
      parsers/
        HolidayCsvParser.js
      repositories/
        HolidayRepository.js
      utils/
        DateUtils.js
      views/
        CalendarRenderer.js
    holiday-update/
      applications/
        HolidayUpdateApplication.js
      config/
        holidayUpdateConfig.js
      schedulers/
        MonthlyScheduler.js
      services/
        HolidayCsvUpdater.js
```

### ブラウザ側の主な責務

- `script.js`
  - カレンダーアプリの起動処理

- `CalendarController.js`
  - 年月の状態管理
  - 操作イベントの登録
  - 描画処理の呼び出し

- `CalendarRenderer.js`
  - カレンダー本体の描画
  - 祝日一覧の描画

- `HolidayRepository.js`
  - 祝日データの保持
  - `data/holidays.js` のデータを優先利用
  - 必要に応じてCSV読み込みへフォールバック

- `HolidayCsvParser.js`
  - CSV文字列の解析

- `DateUtils.js`
  - 日付キー生成
  - 日付加算
  - 年範囲の補正

### 祝日更新側の主な責務

- `.github/workflows/update-holidays.yml`
  - GitHub Actionsで月1回、祝日データ更新処理を実行
  - 差分がある場合のみ自動コミット

- `update-holidays.js`
  - Node.js用の起動エントリーポイント

- `HolidayUpdateApplication.js`
  - 更新処理全体の制御
  - `--watch` オプション判定

- `HolidayCsvUpdater.js`
  - 内閣府CSVの取得
  - CSVファイル保存
  - ブラウザ直接表示用の `holidays.js` 生成

- `MonthlyScheduler.js`
  - 1か月に1回の定期実行管理

- `holidayUpdateConfig.js`
  - CSV URL
  - 保存先
  - タイムゾーン

### ローカルサーバーで確認する場合

`index.html` は直接開いても動作しますが、HTTPサーバー経由で確認したい場合は次のコマンドを使用できます。

```powershell
python -m http.server 8000
```

その後、以下を開きます。

```text
http://localhost:8000/
```

### 構文チェック

すべてのJavaScriptファイルをチェックする場合:

```powershell
Get-ChildItem . -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

祝日更新スクリプトのみ確認する場合:

```powershell
node --check .\update-holidays.js
```

### Gitコメント例

```text
docs: READMEに利用者向けと開発者向けの説明を追加
```
