window.addEventListener('load', () => {
  var config;
  var vm = new Vue({
      el: '#twittperator-sidebar',
      data: {
        tweets: [],
      },
  });
  document.dispatchEvent(new Event('initialized'));

  window.addEventListener('message', (event) => {
    switch (event.data.type) {
      case 'tweet':
        vm.tweets.unshift(preVue(event.data.body));
        if (vm.tweets.length > config.listMax) {
          vm.tweets.pop();
        }
        break;
      case 'archives':
        for (var tweet of event.data.body) {
          vm.tweets.push(preVue(tweet));
        }
        break;
      case 'config':
        config = event.data.body;
    }
  });

  var preVue = (tweet) => {
    var options = {
      urlEntities: tweet.entities,
      usernameIncludeSymbol: true,
      targetBlank: true,
    };
    var escaped = _.escape(tweet.text).replace(/&amp;amp;/g, '&amp;');
    var autoLinked = twttr.txt.autoLink(escaped, options);
    tweet.linkedHtml = twemoji.parse(autoLinked);

    var div = document.createElement('div');
    div.innerHTML = tweet.linkedHtml;
    var length = document.createElement('canvas').getContext('2d').measureText(div.textContent).width;
    if (length < 110) {
      tweet.length = 'tooShort';
    } else if (length < 180) {
      tweet.length = 'short';
    } else if (length < 300) {
      tweet.length = 'middle';
    } else if (length < 600) {
      tweet.length = 'long';
    } else {
      tweet.length = 'tooLong';
    }

    return tweet
  }

  var log = (obj) => {
    document.dispatchEvent(new CustomEvent('log', { detail: obj}));
  }
});
