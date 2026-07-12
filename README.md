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
- 日付にマウスを重ねると強調表示されます。
- 日付をダブルクリックすると、メモ入力用のポップアップを開けます。
- 内閣府の祝日データをもとに祝日を反映します。

### 使い方

1. `index.html` をブラウザで開きます。
2. 年と月を選択します。
3. カレンダーと祝日一覧を確認します。
4. メモを残したい日付をダブルクリックします。
5. ポップアップに内容を入力し、「保存」を押します。
6. メモを削除する場合は、同じ日付をダブルクリックして「削除」を押します。

直接開くファイル:

```text
index.html
```

### 祝日データについて

祝日表示には `data/holidays.js` を使用します。

このファイルは内閣府の祝日CSVから生成されているため、`index.html` を直接ブラウザで開いた場合でも祝日が反映されます。

### 日付メモについて

日付メモはブラウザの `localStorage` に保存されます。

同じブラウザで開く限り、ページを閉じても保存したメモを確認できます。

メモを削除する方法:

- メモ入力ポップアップで「削除」を押します。
- または、内容を空にして「保存」を押します。

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

## サーバーへ配置する場合

このカレンダーは静的サイトとして配置できます。

Node.jsのアプリケーションサーバーは不要です。Webサーバーには、以下のファイルとフォルダをそのまま配置してください。

```text
index.html
styles.css
script.js
data/
scripts/
```

Apache、Nginx、GitHub Pages、静的ホスティングサービスなどで配信できます。

### 配置例

サーバーの公開ディレクトリに、このプロジェクトの中身を配置します。

例:

```text
/var/www/html/calendar/
  index.html
  styles.css
  script.js
  data/
  scripts/
```

ブラウザでは次のようなURLで開きます。

```text
https://example.com/calendar/
```

### サーバー配置時の祝日データ更新

祝日データは `data/holidays.js` に入っています。

そのため、サーバー上でカレンダーを表示するだけなら、Node.jsは不要です。

祝日データを最新化する方法は2つあります。

1. GitHub Actionsで更新する

   GitHub Actionsが月1回 `update-holidays.js` を実行し、`data/syukujitsu.csv` と `data/holidays.js` を更新します。

   サーバーへは、更新後のリポジトリ内容をデプロイしてください。

2. サーバー上で更新する

   サーバーにNode.jsを入れている場合は、次のコマンドで更新できます。

   ```bash
   node update-holidays.js
   ```

   cronで毎月1回実行する場合の例:

   ```cron
   0 0 1 * * cd /var/www/html/calendar && node update-holidays.js
   ```

### サーバー配置時の日付メモ

日付メモはサーバーには保存されません。

メモは利用者ごとのブラウザの `localStorage` に保存されます。

そのため、次のような動きになります。

- 同じ利用者が同じブラウザで開くと、保存したメモが残ります。
- 別のPC、別のブラウザ、別のユーザーには共有されません。
- ブラウザのサイトデータを削除すると、メモも削除されます。

複数ユーザーでメモを共有したい場合は、別途サーバー側の保存機能やデータベースが必要です。

### 複数人でサーバー運用する場合

このカレンダーをサーバーに置いて複数人で使う場合、カレンダー画面と祝日データは全員で同じものを見ます。

共有されるもの:

- カレンダー画面
- 土曜、日曜、祝日の表示
- `data/holidays.js` に入っている祝日データ
- サーバーに配置されているHTML / CSS / JavaScript

共有されないもの:

- 日付メモ
- 各利用者が入力した内容
- 各ブラウザの `localStorage` に保存されたデータ

現在のメモ機能は、利用者ごとのブラウザ内に保存されます。

そのため、Aさんが自分のPCで入力したメモは、BさんのPCやスマートフォンには表示されません。同じサーバーURLを開いていても、メモは共有されません。

#### 全員で同じメモを共有したい場合

全員で同じメモを共有するには、現在の静的サイト構成だけでは足りません。

追加で必要になるもの:

- メモを保存するサーバー側API
- メモを保存するデータベースまたはファイル
- 読み込み、保存、削除用のJavaScript通信処理
- 必要に応じたログインや権限管理

構成例:

```text
ブラウザ
  ↓ メモ取得 / 保存
サーバーAPI
  ↓
データベース
```

共有メモにしたい場合は、`DayMemoRepository.js` の保存先を `localStorage` からサーバーAPIへ変更する形になります。

#### 個人メモとして使う場合

今のままサーバーへ配置すれば、利用者ごとの個人メモとして使えます。

この場合、サーバー側にメモは保存されないため、サーバー管理者が利用者のメモを見ることはできません。

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
        DayMemoRepository.js
        HolidayRepository.js
      utils/
        DateUtils.js
      views/
        CalendarRenderer.js
        DayMemoDialog.js
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
  - メモがある日付の表示

- `HolidayRepository.js`
  - 祝日データの保持
  - `data/holidays.js` のデータを優先利用
  - 必要に応じてCSV読み込みへフォールバック

- `HolidayCsvParser.js`
  - CSV文字列の解析

- `DayMemoRepository.js`
  - 日付メモの保存
  - `localStorage` からの日付メモ読み込み

- `DayMemoDialog.js`
  - 日付メモ入力ポップアップの表示
  - 保存 / キャンセル操作の制御

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
