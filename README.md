vimperator-plugins
==================
### spotify.js
Spotifyのデスクトップアプリを操作する。  
Win, Mac対応

### hatena-bookmark.js
[公式のアドオン](https://addons.mozilla.org/ja/firefox/addon/hatena-bookmark/)の投稿オプションに対応した[direct\_bookmark.js](https://github.com/vimpr/vimperator-plugins/blob/master/direct_bookmark.js)という感じのやつ。  
ステータスラインにはてブ数を表示する機能もある。  
ブックマーク時のタグ補完には`hatena-bookmark-completer.js`が必要。

### twittperator-sidebar.js
サイドバーにTwitterのタイムラインを表示する。[twittperator.js](https://github.com/vimpr/vimperator-plugins/blob/master/twittperator.js)が必要。  
ツイートの長さでフォントサイズが変わったり、引用ツイートに対応してたり、画像も見れる。マウス向けに各種リンクもはってある。

### zenzaWatch.js
[ZenzaWatch](https://greasyfork.org/ja/scripts/14391-zenzawatch)をVimperatorから操作する。

### bookmarklet.js
ブックマークレットをコマンドから実行する。

### copy.js.diff
URLに対応してJavasScriptを実行する機能を[copy.js](https://github.com/vimpr/vimperator-plugins/blob/master/copy.js)に追加する。  
`nnoremap y :copy URL<CR>`などとすると捗る。

### download-statusline.js
ステータスラインにダウンロード状況を表示する。

### ldr-subacc-switcher.js
[LDR](http://reader.livedoor.com/)のサブアカウントを切り替えるコマンドを追加する。

### ldr.js
[LDR](http://reader.livedoor.com/)を操作するコマンドを追加する。

### ldrize.js
LDRizeをVimperatorで。

### steam.js
Steamのゲームを起動したり、ストアページを開いたりする。

### vanish-blank.js
hintでURLを開く際にtarget属性を取り除く。

### yaopen.js
検索のためのyaopenコマンドを追加する。


Memo
------------------
### Add-on SDK つまずきどころ
- page-mod は機能しない
- panel は読み込み時にエラー(Module \`@test/options\` is not found at resource://gre/modules/commonjs/@test/options.js)

### autocommandsではどのタブでイベントが起きたのかわからない
`gBrowser.addProgressListener()`などを使う必要がある。  
参照
- [nsIWebProgressListener - Mozilla | MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIWebProgressListener#onLocationChange())

新しくページを読み込む時と読み込みのない単なるタブ変更などの時で別の処理をする例
``` JavaScript
  webProgressListener = {
    onStateChange: (webProgress, request, flags, status) => {
      if (flags & Ci.nsIWebProgressListener.STATE_IS_DOCUMENT && flags & Ci.nsIWebProgressListener.STATE_START) {
      }
    },
    onLocationChange: (webProgress, request, location, flags) => {
      if (!request) {
      }
    }
  }

  gBrowser.addProgressListener(webProgressListener);

  __context__.onUnload = () => {
    gBrowser.addProgressListener(webProgressListener);
  }
```

### OSで分岐する処理を書きたい
`liberator.has()`を使う。  
OS判定用にはMacUnix, Win32, Win64, Unix, Windowsが用意されていて、WindowsはWin32とWin64両用向け。  
`liberator.has('windows')`はどのOSでも`true`なので要注意。

参照
- [vimperator-labs/liberator.js at master · vimperator/vimperator-labs](https://github.com/vimperator/vimperator-labs/blob/master/common/content/liberator.js#L69)

### context.completionsにpushしてもうまく動かない
`context.compare = CompletionContext.Sort.unsorted`すると直る。  

### その他
昔書いたやつ[Vimperatorプラグインを書いてみたい人のためのtips](http://blog.feelmy.net/2012/12/04/vimperator-plugin-dev-tips/)
