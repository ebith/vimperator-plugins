/* Ref:
 *  hatena/hatena-bookmark-xul: Hatena Bookmark Firefox Add-on - https://github.com/hatena/hatena-bookmark-xul
 * Require:
 *  hatena-bookmark-completer.js
 */
(()=>{
  // azu/hatebu-mydata-parser: はてなブックマークのsearch.dataのパーサライブラリ - https://github.com/azu/hatebu-mydata-parser
  !function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.hatebuMydataParser=t():e.hatebuMydataParser=t()}(window,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parse=function(e){if(null==e)return[];var t=u(e);if(0===t.bookmarks.length||0===t.lines.length)return[];return t.lines.map(function(e,r){var n=3*r,u=e.split("\t",2)[1],i=t.bookmarks[n],s=t.bookmarks[n+1],a=t.bookmarks[n+2];return{title:i,comment:s,url:a,date:o(u)}})};var n=r(1),o=n.dateFromString,u=n.parseLineByLine;new Date},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.dateFromString=function(e){return new Date(e.substring(0,4),parseInt(e.substr(4,2),10)-1,e.substr(6,2),e.substr(8,2),e.substr(10,2),e.substr(12,2))},t.parseLineByLine=function(e){var t=e.trim().split("\n");return{bookmarks:t.splice(0,3*t.length/4),lines:t}}}])});
  // date-fns/date-fns: ⏳ Modern JavaScript date utility library ⌛️ - https://github.com/date-fns/date-fns
  !function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.dateFnsFormat=t():e.dateFnsFormat=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t,n){var r=n(2),o=36e5,u=6e4,a=2,i=/[T ]/,s=/:/,c=/^(\d{2})$/,f=[/^([+-]\d{2})$/,/^([+-]\d{3})$/,/^([+-]\d{4})$/],l=/^(\d{4})/,d=[/^([+-]\d{4})/,/^([+-]\d{5})/,/^([+-]\d{6})/],g=/^-(\d{2})$/,p=/^-?(\d{3})$/,m=/^-?(\d{2})-?(\d{2})$/,v=/^-?W(\d{2})$/,h=/^-?W(\d{2})-?(\d{1})$/,D=/^(\d{2}([.,]\d*)?)$/,x=/^(\d{2}):?(\d{2}([.,]\d*)?)$/,y=/^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/,M=/([Z+-].*)$/,S=/^(Z)$/,T=/^([+-])(\d{2})$/,b=/^([+-])(\d{2}):?(\d{2})$/;function Y(e,t,n){t=t||0,n=n||0;var r=new Date(0);r.setUTCFullYear(e,0,4);var o=7*t+n+1-(r.getUTCDay()||7);return r.setUTCDate(r.getUTCDate()+o),r}e.exports=function(e,t){if(r(e))return new Date(e.getTime());if("string"!=typeof e)return new Date(e);var n=(t||{}).additionalDigits;n=null==n?a:Number(n);var F=function(e){var t,n={},r=e.split(i);if(s.test(r[0])?(n.date=null,t=r[0]):(n.date=r[0],t=r[1]),t){var o=M.exec(t);o?(n.time=t.replace(o[1],""),n.timezone=o[1]):n.time=t}return n}(e),w=function(e,t){var n,r=f[t],o=d[t];if(n=l.exec(e)||o.exec(e)){var u=n[1];return{year:parseInt(u,10),restDateString:e.slice(u.length)}}if(n=c.exec(e)||r.exec(e)){var a=n[1];return{year:100*parseInt(a,10),restDateString:e.slice(a.length)}}return{year:null}}(F.date,n),H=w.year,O=function(e,t){if(null===t)return null;var n,r,o,u;if(0===e.length)return(r=new Date(0)).setUTCFullYear(t),r;if(n=g.exec(e))return r=new Date(0),o=parseInt(n[1],10)-1,r.setUTCFullYear(t,o),r;if(n=p.exec(e)){r=new Date(0);var a=parseInt(n[1],10);return r.setUTCFullYear(t,0,a),r}if(n=m.exec(e)){r=new Date(0),o=parseInt(n[1],10)-1;var i=parseInt(n[2],10);return r.setUTCFullYear(t,o,i),r}if(n=v.exec(e))return u=parseInt(n[1],10)-1,Y(t,u);if(n=h.exec(e)){u=parseInt(n[1],10)-1;var s=parseInt(n[2],10)-1;return Y(t,u,s)}return null}(w.restDateString,H);if(O){var I,$=O.getTime(),W=0;return F.time&&(W=function(e){var t,n,r;if(t=D.exec(e))return(n=parseFloat(t[1].replace(",",".")))%24*o;if(t=x.exec(e))return n=parseInt(t[1],10),r=parseFloat(t[2].replace(",",".")),n%24*o+r*u;if(t=y.exec(e)){n=parseInt(t[1],10),r=parseInt(t[2],10);var a=parseFloat(t[3].replace(",","."));return n%24*o+r*u+1e3*a}return null}(F.time)),F.timezone?I=function(e){var t,n;return(t=S.exec(e))?0:(t=T.exec(e))?(n=60*parseInt(t[2],10),"+"===t[1]?-n:n):(t=b.exec(e))?(n=60*parseInt(t[2],10)+parseInt(t[3],10),"+"===t[1]?-n:n):0}(F.timezone):(I=new Date($+W).getTimezoneOffset(),I=new Date($+W+I*u).getTimezoneOffset()),new Date($+W+I*u)}return new Date(e)}},function(e,t,n){var r=n(11);e.exports=function(e){return r(e,{weekStartsOn:1})}},function(e,t){e.exports=function(e){return e instanceof Date}},function(e,t,n){var r=n(0),o=n(1);e.exports=function(e){var t=r(e),n=t.getFullYear(),u=new Date(0);u.setFullYear(n+1,0,4),u.setHours(0,0,0,0);var a=o(u),i=new Date(0);i.setFullYear(n,0,4),i.setHours(0,0,0,0);var s=o(i);return t.getTime()>=a.getTime()?n+1:t.getTime()>=s.getTime()?n:n-1}},function(e,t,n){e.exports=n(5)},function(e,t,n){var r=n(6),o=n(10),u=n(3),a=n(0),i=n(13),s=n(14);var c={M:function(e){return e.getMonth()+1},MM:function(e){return d(e.getMonth()+1,2)},Q:function(e){return Math.ceil((e.getMonth()+1)/3)},D:function(e){return e.getDate()},DD:function(e){return d(e.getDate(),2)},DDD:function(e){return r(e)},DDDD:function(e){return d(r(e),3)},d:function(e){return e.getDay()},E:function(e){return e.getDay()||7},W:function(e){return o(e)},WW:function(e){return d(o(e),2)},YY:function(e){return d(e.getFullYear(),4).substr(2)},YYYY:function(e){return d(e.getFullYear(),4)},GG:function(e){return String(u(e)).substr(2)},GGGG:function(e){return u(e)},H:function(e){return e.getHours()},HH:function(e){return d(e.getHours(),2)},h:function(e){var t=e.getHours();return 0===t?12:t>12?t%12:t},hh:function(e){return d(c.h(e),2)},m:function(e){return e.getMinutes()},mm:function(e){return d(e.getMinutes(),2)},s:function(e){return e.getSeconds()},ss:function(e){return d(e.getSeconds(),2)},S:function(e){return Math.floor(e.getMilliseconds()/100)},SS:function(e){return d(Math.floor(e.getMilliseconds()/10),2)},SSS:function(e){return d(e.getMilliseconds(),3)},Z:function(e){return l(e.getTimezoneOffset(),":")},ZZ:function(e){return l(e.getTimezoneOffset())},X:function(e){return Math.floor(e.getTime()/1e3)},x:function(e){return e.getTime()}};function f(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|]$/g,""):e.replace(/\\/g,"")}function l(e,t){t=t||"";var n=e>0?"-":"+",r=Math.abs(e),o=r%60;return n+d(Math.floor(r/60),2)+t+d(o,2)}function d(e,t){for(var n=Math.abs(e).toString();n.length<t;)n="0"+n;return n}e.exports=function(e,t,n){var r=t?String(t):"YYYY-MM-DDTHH:mm:ss.SSSZ",o=(n||{}).locale,u=s.format.formatters,l=s.format.formattingTokensRegExp;o&&o.format&&o.format.formatters&&(u=o.format.formatters,o.format.formattingTokensRegExp&&(l=o.format.formattingTokensRegExp));var d=a(e);return i(d)?function(e,t,n){var r,o,u=e.match(n),a=u.length;for(r=0;r<a;r++)o=t[u[r]]||c[u[r]],u[r]=o||f(u[r]);return function(e){for(var t="",n=0;n<a;n++)u[n]instanceof Function?t+=u[n](e,c):t+=u[n];return t}}(r,u,l)(d):"Invalid Date"}},function(e,t,n){var r=n(0),o=n(7),u=n(8);e.exports=function(e){var t=r(e);return u(t,o(t))+1}},function(e,t,n){var r=n(0);e.exports=function(e){var t=r(e),n=new Date(0);return n.setFullYear(t.getFullYear(),0,1),n.setHours(0,0,0,0),n}},function(e,t,n){var r=n(9),o=6e4,u=864e5;e.exports=function(e,t){var n=r(e),a=r(t),i=n.getTime()-n.getTimezoneOffset()*o,s=a.getTime()-a.getTimezoneOffset()*o;return Math.round((i-s)/u)}},function(e,t,n){var r=n(0);e.exports=function(e){var t=r(e);return t.setHours(0,0,0,0),t}},function(e,t,n){var r=n(0),o=n(1),u=n(12),a=6048e5;e.exports=function(e){var t=r(e),n=o(t).getTime()-u(t).getTime();return Math.round(n/a)+1}},function(e,t,n){var r=n(0);e.exports=function(e,t){var n=t&&Number(t.weekStartsOn)||0,o=r(e),u=o.getDay(),a=(u<n?7:0)+u-n;return o.setDate(o.getDate()-a),o.setHours(0,0,0,0),o}},function(e,t,n){var r=n(3),o=n(1);e.exports=function(e){var t=r(e),n=new Date(0);return n.setFullYear(t,0,4),n.setHours(0,0,0,0),o(n)}},function(e,t,n){var r=n(2);e.exports=function(e){if(r(e))return!isNaN(e);throw new TypeError(toString.call(e)+" is not an instance of Date")}},function(e,t,n){var r=n(15),o=n(16);e.exports={distanceInWords:r(),format:o()}},function(e,t){e.exports=function(){var e={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}};return{localize:function(t,n,r){var o;return r=r||{},o="string"==typeof e[t]?e[t]:1===n?e[t].one:e[t].other.replace("{{count}}",n),r.addSuffix?r.comparison>0?"in "+o:o+" ago":o}}}},function(e,t,n){var r=n(17);e.exports=function(){var e=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],t=["January","February","March","April","May","June","July","August","September","October","November","December"],n=["Su","Mo","Tu","We","Th","Fr","Sa"],o=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],u=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],a=["AM","PM"],i=["am","pm"],s=["a.m.","p.m."],c={MMM:function(t){return e[t.getMonth()]},MMMM:function(e){return t[e.getMonth()]},dd:function(e){return n[e.getDay()]},ddd:function(e){return o[e.getDay()]},dddd:function(e){return u[e.getDay()]},A:function(e){return e.getHours()/12>=1?a[1]:a[0]},a:function(e){return e.getHours()/12>=1?i[1]:i[0]},aa:function(e){return e.getHours()/12>=1?s[1]:s[0]}};return["M","D","DDD","d","Q","W"].forEach(function(e){c[e+"o"]=function(t,n){return function(e){var t=e%100;if(t>20||t<10)switch(t%10){case 1:return e+"st";case 2:return e+"nd";case 3:return e+"rd"}return e+"th"}(n[e](t))}}),{formatters:c,formattingTokensRegExp:r(c)}}},function(e,t){var n=["M","MM","Q","D","DD","DDD","DDDD","d","E","W","WW","YY","YYYY","GG","GGGG","H","HH","h","hh","m","mm","s","ss","S","SS","SSS","Z","ZZ","X","x"];e.exports=function(e){var t=[];for(var r in e)e.hasOwnProperty(r)&&t.push(r);var o=n.concat(t).sort().reverse();return new RegExp("(\\[[^\\[]*\\])|(\\\\)?("+o.join("|")+"|.)","g")}}])});

  const config = liberator.globalVariables.hatena_bookmark || {
    useStatuslineCounter: false,
  };

  const {Task} = Cu.import('resource://gre/modules/Task.jsm', {});

  let subCommands = [
    // new Command([''], '', (args) => {}, {}, true),
    new Command(['o[pen]'], 'ブックマークから開く', (args) => {
      liberator.open(args[0], liberator.NEW_TAB);
    }, {
      literal: 0,
      completer: (context, args) => {
        context.incomplete = true;
        getBookmarks().then(bookmarks => {
          Object.assign(hatebu.bookmarks, bookmarks);
        });
        context.incomplete = false;
        context.compare = CompletionContext.Sort.unsorted;
        context.filters = [CompletionContext.Filter.textDescription];
        context.title = ['URL', 'Title (Comment)'];
        let completions = [];
        for (let bookmark of hatebu.bookmarks) {
          completions.push([bookmark.url, `${bookmark.title} (${bookmark.comment})`]);
        }
        context.completions = completions;
      }
    }, true),
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
      completer: liberator.plugins.hatenaBookmarkCompleter.completer,
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

  let getBookmarks = () => {
    return new Promise(resolve => {
      fetch(`http://b.hatena.ne.jp/${hatebu.user.name}/search.data?timestamp=${hatebu.sinceTime ? dateFnsFormat(hatebu.sinceTime, 'YYYYMMDDHHmmss') : ''}`).then(response => {
        if (response.ok) {
          response.text().then(body => {
            hatebu.sinceTime = new Date();
            resolve(hatebuMydataParser.parse(body));
          });
        }
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
      if (!hatebu.count[url] && /^https?:\/\//.test(url)) {
        fetch(`https://b.hatena.ne.jp/entry.count?url=${encodeURIComponent(url)}`).then(response => {
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
        if (browser.currentURI.spec === location.spec && webProgress.isLoadingDocument) {
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
    hatebu.bookmarks = yield getBookmarks();

    commands.addUserCommand(['hatenaBookmark', 'hatebu'], 'はてなブックマーク', (args) => {
    }, {
      subCommands
    }, true);

    __context__.tags = hatebu.tags;
    __context__.bookmarks = hatebu.bookmarks;
  });
})();

