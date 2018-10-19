(() => {
  let zwUrl = 'https://www.nicovideo.jp/my#ZenzaWatch';
  let zw = () => { return zwBrowser.contentWindow.wrappedJSObject.ZenzaWatch; };
  let zwBrowser;
  let subCommands = [
    // new Command([''], '', (args) => {}, {}, true),
    new Command(['zoomVideo'], '画面モードのWIDEと大を切り替える', (args) => {
      switch(zw().debug.nicoVideoPlayer._playerState.screenMode) {
        case 'big':
          zw().external.execCommand('screenMode', 'wide');
          break;
        case 'wide':
          zw().external.execCommand('screenMode', 'big');
          break;
      }
    }, {}, true),
    new Command(['addNGUser'], '表示中のコメントからNGユーザを追加する', (args) => {
      let chatList = zw().debug.nicoCommentPlayer.getChatList();
      for (let chat of chatList.top.concat(chatList.naka, chatList.bottom)) {
        if (chat._id === args[0]) {
          zw().debug.nicoCommentPlayer.addUserIdFilter(chat._userId);
        }
      }
    }, {
      completer: (context, args) => {
        context.compare = CompletionContext.Sort.unsorted;
        context.title = ['chatID', 'Comment'];
        let comments = zw().debug.getInViewElements();
        let completions = [];
        for (let comment of comments) {
          completions.push([comment.id, JSON.parse(comment.dataset.meta).text]);
        }
        context.completions = completions;
      }
    }, true),
    new Command(['selectTab'], 'タブを選ぶ', (args) => {
      zwBrowser.contentDocument.getElementsByClassName(`tabSelect ${args[0]}`)[0].click();
    }, {
      completer: (context, args) => {
        context.compare = CompletionContext.Sort.unsorted;
        context.title = ['Class', 'Title'];
        let tabs = zwBrowser.contentDocument.getElementsByClassName('tabSelect');
        let completions = [];
        for (let tab of tabs) {
          completions.push([tab.classList[1], tab.textContent]);
        }
        context.completions = completions;
      }
    }, true),
    new Command(['relations'], '動画説明文からリンクを開く', (args) => {
      let match = /https?:\/\/www\.nicovideo\.jp\/watch\/([a-z]{2}\d+|\d+)/.exec(args[0]);
      if (match) {
        commands.get('zenzaWatch').execute(`open ${match[1]}`);
      } else {
        if (TreeStyleTabService) { TreeStyleTabService.readyToOpenChildTabNow(gBrowser.selectedTab); }
        liberator.open(args[0], liberator.NEW_TAB)
      }
    }, {
      completer: (context, args) => {
        context.compare = CompletionContext.Sort.unsorted;
        context.title = ['Url', 'Description'];
        let links = zwBrowser.contentDocument.getElementsByClassName('videoDescription')[0].getElementsByTagName('a');
        let completions = [];
        for (let link of links) {
          if (link.href && link.previousSibling) {
            completions.push([link.href, link.previousSibling.textContent]);
          } else if (link.href) {
            completions.push([link.href, link.parentNode.parentNode.parentNode.previousSibling.textContent]);
          }
        }
        context.completions = completions;
      }
    }, true),
    new Command(['zoomDescription'], '動画の説明を拡大する(トグル)', (args) => {
      let panel = zwBrowser.contentDocument.getElementsByClassName('zenzaWatchVideoInfoPanel')[0];
      panelStyle = zwBrowser.contentWindow.getComputedStyle(panel);
      if (panelStyle.left === '0px') {
        panel.style.left = 'calc(100%)';
        panel.style.width = '320px';
        panel.getElementsByClassName('videoOwnerInfoContainer')[0].style.display = 'block';
        panel.getElementsByClassName('tabSelectContainer')[0].style.display = 'block';
      } else {
        panel.style.left = '0px';
        panel.style.width = 'calc(100% + 320px)';
        panel.getElementsByClassName('videoOwnerInfoContainer')[0].style.display = 'none';
        panel.getElementsByClassName('tabSelectContainer')[0].style.display = 'none';
      }
    }, {}, true),
    new Command(['executeCommand', 'exec'], 'Vimperatorのコマンドを実行する', (args) => {
      let table = {
        '%TITLE%': () => { return zw().debug.dialog._videoInfo._videoDetail.title; },
        '%URL%': () => { return `https?://www.nicovideo.jp/watch/${zw().debug.dialog._watchId }`; },
        '%VIDEO_ID%': () => { return zw().debug.dialog._watchId; }
      };
      let arg = args.literalArg;
      for (let ph in table) {
        arg = arg.replace(ph, table[ph]());
      }
      setTimeout(() => commandline.open('', `:${arg} `, modes.EX), 0);
    }, {
      literal: 0
    }, true),
    new Command(['seek'], '', (args) => {
      zw().debug.nicoVideoPlayer.setCurrentTime(zw().debug.nicoVideoPlayer.getCurrentTime() + parseInt(args.literalArg, 10));
    }, {
      literal: 0
    }, true),
    new Command(['mute'], '', (args) => {
      zw().config.setValue('mute', !zw().config.getValue('mute'));
    }, {}, true),
    new Command(['volume'], '', (args) => {
      let volume = zw().debug.nicoVideoPlayer._videoPlayer.getVolume();
      if (/^(\+|-)/.test(args.literalArg)) {
        volume += args.literalArg * 0.1;
      } else {
        volume = args.literalArg * 0.1;
      }
      zw().debug.nicoVideoPlayer._videoPlayer.setVolume(volume);
    }, {
      literal: 0
    }, true),
    new Command(['showComment'], 'コメントを表示する(トグル)', (args) => {
      zw().config.setValue('showComment', !zw().config.getValue('showComment'));
    }, {}, true),
    new Command(['close'], '', (args) => {
      zw().debug.dialog.close();
    }, {}, true),
    new Command(['play'], '再生する(トグル)', (args) => {
      zw().debug.nicoVideoPlayer.togglePlay();
    }, {}, true),
    new Command(['open'], '', (args) => {
      if (args.length === 0) {
        let match = /https?:\/\/www\.nicovideo\.jp\/watch\/([a-z]{2}\d+|\d+)/.exec(buffer.URL);
        if (match) {
          let selectedTab = gBrowser.selectedTab;
          commands.get('zenzaWatch').execute(`open ${match[1]}`);
          gBrowser.removeTab(selectedTab);
        }
      } else {
        let zwTab;
        let init = (zwBrowser) => {
          let document = zwBrowser.contentDocument;
          let jso = zwBrowser.contentWindow.wrappedJSObject;
          document.title = 'ZenzaWatch Player';
          let i = 0;
          let intervalId = setInterval(() => {
            i++;
            if (jso.ZenzaWatch && jso.ZenzaWatch.debug && jso.ZenzaWatch.debug.dialog || i > 100) {
              clearInterval(intervalId);
              jso.ZenzaWatch.debug.dialog.open(videoId);
              // document.title = jso.ZenzaWatch.debug.dialog._videoInfo._videoDetail.title;
            }
          }, 100);
        };
        let videoId = args[0];
        for (let tab of gBrowser.tabs) {
          if (zwUrl === tab.linkedBrowser.currentURI.spec){
            zwTab = tab;
          }
        }
        if (zwTab) {
          zwBrowser = zwTab.linkedBrowser;
          gBrowser.selectedTab = zwTab;
          init(zwBrowser);
        } else {
          if (TreeStyleTabService) { TreeStyleTabService.readyToOpenChildTabNow(gBrowser.selectedTab); }
          zwBrowser = gBrowser.loadOneTab(zwUrl, {inBackground: args.bang}).linkedBrowser;
          zwBrowser.addEventListener('DOMContentLoaded', function onload() {
            zwBrowser.removeEventListener('DOMContentLoaded', onload, false);
            init(zwBrowser);
          }, false);
        }
      }
    }, {
      bang: true
    }, true)
  ];

  commands.addUserCommand(['zenzaWatch'], 'ZenzaWatchを呼び出す', (args) => {
  }, {
    subCommands
  }, true);
})();
