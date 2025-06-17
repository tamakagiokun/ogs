// ★★★ ここにデプロイしたApps ScriptのウェブアプリURLを貼り付けます ★★★
const appsScriptUrl = 'https://script.google.com/macros/s/AKfycby2mkTBlxbUGTGryTBMXmXnsgpOsNmqWo1woK9-vtSwlmN0vS1YJuBs5zA6uXSSjrUc/exec'; // 例: https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec

// メッセージ送信ボタンが押されたときに呼び出される関数
async function sendMessage() { // asyncキーワードを追加
    // 各入力フィールドの値を取得
    const name = document.getElementById('name').value;
    const budget = document.getElementById('budget').value;
    const quantity = document.getElementById('quantity').value;
    const type = document.getElementById('type').value;

    // 入力チェック
    if (!name || !budget || !quantity || !type) {
        document.getElementById('response').textContent = 'すべてのフィールドを入力してください。';
        return;
    }

    // UIを更新
    document.getElementById('response').textContent = '検索中...';
    document.getElementById('sendMessageButton').disabled = true; // ボタンを無効化

    // GASに送信するデータを作成
    const requestData = {
        name: name,
        budget: budget,
        quantity: quantity,
        type: type
    };

    try {
        // APIリクエストをGASに送信
        const response = await fetch(appsScriptUrl, { // awaitキーワードを追加
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData) // GASに送信するデータをJSON形式で渡す
        });

        if (!response.ok) {
            throw new Error(`HTTPエラー！ステータス: ${response.status}`);
        }

        const data = await response.json(); // awaitキーワードを追加
        console.log('GAS経由のOpenAIからの生データ:', data);

        let outputText = '';
        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            outputText = data.choices[0].message.content;
        } else if (data.error) {
            outputText = `エラー: ${data.error}`;
        } else {
            outputText = '予期しない応答形式です。';
            console.error('予期しない応答形式:', data);
        }

        // 回答を100字ごとに改行 (この処理はGAS側ではなくクライアント側で行う)
        const formattedOutput = outputText.replace(/(.{100})/g, '$1\n');
        document.getElementById('response').textContent = formattedOutput;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('response').textContent = `リクエスト中にエラーが発生しました: ${error.message}`;
    } finally {
        document.getElementById('sendMessageButton').disabled = false; // ボタンを再度有効化
    }
}