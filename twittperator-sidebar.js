// Original: vimperator-plugins/twsidebar.tw at master · vimpr/vimperator-plugins - https://github.com/vimpr/vimperator-plugins/blob/master/twittperator/twsidebar.tw
(()=>{
  const config = liberator.globalVariables.twittperator_sidebar || {
    resourceDir: io.expandPath('~/.vimperator/ebith/resources'),
    screenName: 'ebith',
    myNames: /ebith|えびさん|エビさん/,
    vanish: /#sinkan/,
    listMax: 100,
    jpOnly: true,
    timeFormat: '%H:%M',
  };

  const {require} = Cu.import('resource://gre/modules/commonjs/toolkit/require.js', {});
  const {FileUtils} = Cu.import('resource://gre/modules/FileUtils.jsm', {});
  const uuid = require('sdk/util/uuid').uuid();

  let file = new FileUtils.File(config.resourceDir);
  let resourceDirUri = Services.io.newFileURI(file);
  Services.io.getProtocolHandler('resource').QueryInterface(Ci.nsIResProtocolHandler).setSubstitution(uuid, resourceDirUri);

  let sidebar = require('sdk/ui/sidebar').Sidebar({
    id: 'twittperator-sidebar',
    title: 'Twittperator Sidebar',
    url: `resource://${uuid}/twittperator-sidebar.html`,
    onAttach: (worker) => {
      document.getElementById('sidebar').contentDocument.getElementById('web-panels-browser').addEventListener('DOMWindowCreated', (event) => {
        let htmlDocument = event.explicitOriginalTarget;
        htmlDocument.addEventListener('initialized', () => {
          init(htmlDocument);
        });
        htmlDocument.addEventListener('log', (obj) => {
          liberator.plugins.ebith.log(obj.detail);
        });
      });
    },
  });
  sidebar.show();

  function init(htmlDocument) {
    sendData('config', {listMax: config.listMax});
    let tweets = [];
    for (let tweet of liberator.plugins.twittperator.Tweets.slice(0, config.listMax)) {
      if (tweet = processTweet(tweet, 'archive')) {
        tweets.push(tweet);
      }
    }
    sendData('archives', tweets);
    // htmlDocument.dispatchEvent(new Event('archivesLoaded'));
  }

  function onMsg(msg, raw, streamName) {
    sendData('tweet', processTweet(msg, streamName));
  }

  function processTweet(msg, streamName) {
    let tweet;
    let my = msg.direct_message
      || msg.in_reply_to_screen_name === config.screenName
      || config.myNames.test(msg.text)
      || (msg.retweeted_status && msg.retweeted_status.user.screen_name === config.screenName)
      || (msg.quoted_status && msg.quoted_status.user.screen_name === config.screenName)
      || (msg.event && (
                (msg.event === 'favorite' && msg.target_object.user.screen_name == config.screenName)
                ||
                (msg.event === 'list_member_added' && msg.target.screen_name == config.screenName)
            ))

    let jp =  new RegExp('[\\u4e00-\\u9fa0\\u30A1-\\u30F6\\u30FC\\u3042-\\u3093\\u3001\\u3002\\uFF01\\uFF1F]');
    if (!my && streamName === 'filter' && msg.text && config.jpOnly && !jp.test(msg.text)) { return false; }

    if (msg.event) {
      // tweet = {
      // }
      switch (msg.event) {
        case 'block':
        case 'unblock':
        case 'favorite':
        case 'unfavorite':
        case 'follow':
        case 'unfollow':
        case 'list_created':
        case 'list_destroyed':
        case 'list_updated':
        case 'list_member_added':
        case 'list_member_removed':
        case 'list_user_subscribed':
        case 'list_user_unsubscribed':
        case 'quoted_tweet':
        case 'user_update':
      }
    } else if (msg.direct_message) {
      tweet = {
        name: msg.direct_message.sender.screen_name,
        img: msg.direct_message.sender.profile_image_url,
        text: msg.direct_message.text,
        info: 'DM',
        type: 'DM',
        entities: flattenEntities(msg.entities),
      }
    } else if (msg.quoted_status) {
      tweet = {
        name: msg.user.screen_name,
        img: msg.user.profile_image_url,
        text: `${msg.text} >> @${msg.quoted_status.user.screen_name}: ${msg.quoted_status.text}`,
        info: msg.user.screen_name,
        entities: flattenEntities(msg.entities, msg.quoted_status.entities),
        type: 'quote',
      }
    } else if (msg.retweeted_status) {
      tweet = {
        name: my ? msg.user.screen_name : msg.retweeted_status.user.screen_name,
        img: my ? msg.user.profile_image_url : msg.retweeted_status.user.profile_image_url,
        text: msg.retweeted_status.text,
        info: msg.user.screen_name,
        entities: flattenEntities(msg.retweeted_status.entities),
        type: 'retweet',
      }
    } else if (msg.in_reply_to_screen_name === config.screenName) {
      tweet = {
        name: msg.user.screen_name,
        img: msg.user.profile_image_url,
        text: msg.text,
        info: new Date(msg.created_at).toLocaleFormat(config.timeFormat),
        entities: flattenEntities(msg.entities),
        type: 'reply',
      }
    } else if (msg.text) {
      tweet = {
        name: msg.user.screen_name,
        img: msg.user.profile_image_url,
        text: msg.text,
        info: new Date(msg.created_at).toLocaleFormat(config.timeFormat),
        entities: flattenEntities(msg.entities),
        type: 'normal',
      }
    }

    if (tweet) {
      if (!my && config.vanish.test([tweet.name, tweet.text, tweet.info].join(' '))) { return false; }

      tweet.classes = [
        tweet.type,
        streamName,
        msg.user.protected ? 'protected' : null,
        my ? 'my' : null,
        msg.entities.media ? 'media' : null,
      ].join(' ');

      if (msg.entities.media) {
        tweet.media = flattenEntities({media: msg.entities.media});
      }

      tweet.id = msg.id;

      return tweet;
    } else {
      return false;
    }

    function flattenEntities(...args) {
      let flattened = [];
      for (let entities of args) {
        // for-of使うとentities[Symbol.iterator] is not a function
        for (let k in entities) {
          for (let i in entities[k]) {
            flattened.push(entities[k][i]);
          }
        }
      }
      return flattened;
    }
  }

  function sendData(type, body) {
    if (body) {
      document.getElementById('sidebar').contentDocument.getElementById('web-panels-browser').contentWindow.postMessage({type, body}, '*');
    }
  }

  // https://github.com/vimpr/vimperator-plugins/blob/master/twittperator/dump-msg.tw
  function objectToString (obj, head) {
    if (!head)
      head = '';
    let result = '';
    for (let [n, v] in Iterator(obj)) {
      if (v && typeof v === 'object') {
        result += head + n + ':\n' + objectToString(v, head + '  ');
      } else {
        result += head + n + ': ' + v + '\n';
      }
    }
    return result;
  }

  let added = {};
  function makeOnMsg(streamName) {
    return function (msg, raw) {
      return onMsg(msg, raw, streamName);
    }
  }

  liberator.plugins.twittperator.ChirpUserStream.addListener(added.chirp = makeOnMsg('chirp'));
  liberator.plugins.twittperator.TrackingStream.addListener(added.filter = makeOnMsg('filter'));

  __context__.onUnload = () => {
    sidebar.hide();
    sidebar.dispose();
    liberator.plugins.twittperator.ChirpUserStream.removeListener(added.chirp);
    liberator.plugins.twittperator.TrackingStream.removeListener(added.filter);
  };
})();
