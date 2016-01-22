/* Ref:
 *  hatena/hatena-bookmark-xul: Hatena Bookmark Firefox Add-on - https://github.com/hatena/hatena-bookmark-xul
 * Require:
 *  hatena-bookmark-completer.js
 */
(()=>{
  const config = liberator.globalVariables.hatena_bookmark || {
    useStatuslineCounter: false,
  };

  const {Task} = Cu.import('resource://gre/modules/Task.jsm', {});

  let subCommands = [
    // new Command([''], '', (args) => {}, {}, true),
    new Command(['up[date]'], '補完のタグを更新する', (args) => {
      getTags().then(tags => {
        hatebu.tags = tags;
        liberator.echo('更新できた');
      });
    }, {}, true),
    new Command(['p[ost]'], 'ブックマークする', (args) => {
      let params = {
        rks: hatebu.user.rks,
        url: args['-u'] || buffer.URL,
        comment: args.literalArg,
        post_twitter: args['-t'] ? 1 : 0,
        post_facebook: 0,
        post_evernote: 0,
        post_mixi_check: 0,
      }
      let body = new FormData;
      for (let key in params) {
        body.append(key, params[key]);
      }
      fetch(`http://b.hatena.ne.jp/${hatebu.user.name}/add.edit.json`, {
        method: 'POST',
        credentials: 'include',
        body,
      }).then(response => {
        if (response.ok) { liberator.echo('はてブした'); }
      });
    }, {
      literal: 0,
      options: [
        [['-u', '-url'], liberator.modules.commands.OPTION_STRING],
        [['-t', '-twitter'], liberator.modules.commands.OPTION_NOARG],
      ],
      completer: liberator.modules.plugins.hatenaBookmarkCompleter.completer,
    }, true),
  ];

  let login = () => {
    return new Promise((resolve, reject) => {
      fetch('http://b.hatena.ne.jp/my.name', {credentials: 'include'}).then(response => {
        response.json().then(body => {
          if (body.login) {
            resolve(body);
          } else {
            let {username, password} = Cc['@mozilla.org/login-manager;1'].getService(Ci.nsILoginManager).findLogins({}, 'https://www.hatena.ne.jp', '', null)[0];
            if (!username || !password) { reject(); }
            let loginForm = new FormData;
            loginForm.append('name', username);
            loginForm.append('password', password);
            fetch('https://www.hatena.ne.jp/login', {
              method: 'POST',
              credentials: 'include',
              body: loginForm,
            }).then(response => {
              if (response.ok) {
                resolve(login());
              }
            });
          }
        });
      });
    });
  }

  let getTags = () => {
    return new Promise(resolve => {
      fetch(`http://b.hatena.ne.jp/${hatebu.user.name}/tags.json`).then(response => {
        if (response.ok) {
          response.json().then(body => {
            let tags = [];
            for (let tag in body.tags) {
              tags.push(tag)
            }
            resolve(tags);
          });
        }
      });
    });
  }

  let setupStatuslineCounter = () => {
    let e = document.createElement('label');
    e.id = 'liberator-status-hbcount';
    e.style.fontWeight = 'bold';
    document.getElementById('liberator-status').appendChild(e);

    hatebu.count = {};
    statusline.addField('hbcount', 'はてブ数', 'liberator-status-hbcount', (node, url) => {
      if (url) {
        fetch(`https://b.st-hatena.com/entry.count?url=${encodeURIComponent(url)}`).then(response => {
          if (response.ok) {
            response.text().then(count => {
              hatebu.count[url] = count - 0;
              if (buffer.URL === url) {
                node.value = hatebu.count[url];
              }
            });
          }
        });
      } else {
        node.value = hatebu.count[buffer.URL] || 0;
      }
    });

    let webProgressListener = {
      onLocationChange: (browser, webProgress, request, location, flags) => {
        if (request) {
          statusline.updateField('hbcount', location.spec);
        }
      }
    }
    gBrowser.addTabsProgressListener(webProgressListener);

    let onTabSelect = () => {
        statusline.updateField('hbcount', null);
    }
    gBrowser.tabContainer.addEventListener('TabSelect', onTabSelect);

    __context__.onUnload = () => {
      gBrowser.removeTabsProgressListener(webProgressListener);
      gBrowser.tabContainer.removeEventListener('TabSelect', onTabSelect);
    }
  }

  let hatebu = {};
  Task.spawn(function* () {
    if (config.useStatuslineCounter) { setupStatuslineCounter(); }
    hatebu.user = yield login();
    hatebu.tags = yield getTags();

    commands.addUserCommand(['hatenaBookmark', 'hatebu'], 'はてなブックマーク', (args) => {
    }, {
      subCommands
    }, true);

    __context__.tags = hatebu.tags;
  });
})();
