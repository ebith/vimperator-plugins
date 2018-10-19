// Generated by CoffeeScript 1.7.1
/*
Refs:
  LDRize for Greasemonkey - http://userscripts.org/scripts/show/11562
  [keysnail]LDRnail - https://gist.github.com/958/1369730

Require:
  vimperator-plugins/_libly.js at master · vimpr/vimperator-plugins - https://github.com/vimpr/vimperator-plugins/blob/master/_libly.js
  vimperator/plugin/smooth-scroll.js at master · caisui/vimperator - https://github.com/caisui/vimperator/blob/master/plugin/smooth-scroll.js
  ツリー型タブ (Tree Style Tab) :: Add-ons for Firefox - https://addons.mozilla.org/ja/firefox/addon/tree-style-tab/
 */

(function() {
  var $U, CURRENT_CLASS, DEFAULT_HEIGHT, INTELLIGENCE_CLASS, PINNED_CLASS, SKIP_HEIGHT, USE_INTELLIGENCE_SCROLL, addLocalMappings, attachClassToNode, config, getNodeClientRect, ldrize, removeClassToNode, scrollBy, scrollTo;

  config = liberator.globalVariables.ldrize || {
    commands: {
      readItLater: (currentItem) => {
        liberator.plugins.readitlater.API.add(currentItem.href, currentItem.textContent, () => {
          liberator.echo(`[readitlater] Added: ${currentItem.textContent}`);
        });
      }
    },
    maps: {
      p: 'readItLater',
    },
    siteinfo: [
      {
        name: 'ニコニコ動画 ランキング',
        domain: '^http://(?:(?:de|tw|es|www)\\.nicovideo\\.jp|video\\.niconico\\.com)/ranking',
        paragraph: '//li[contains(@class, "videoRanking")]',
        link: './/a[contains(@href, \"watch/\")][text()]',
        height: -10,
        commands: {
          open: function(currentItem) {
            id = /[a-z]{2}\d+|\d+/.exec(currentItem.href);
            return commands.get('zenzaWatch').execute("open " + id[0]);
          }
        }
      }, {
        name: 'ニコニコ動画 マイリスト',
        domain: '^http://(?:(?:de|tw|es|www)\\.nicovideo\\.jp|video\\.niconico\\.com)/mylist',
        paragraph: '//div[@class="SYS_box_item"]',
        link: './/a[contains(@href, \"watch/\")][text()]',
        height: -10,
        commands: {
          open: function(currentItem) {
            id = /[a-z]{2}\d+|\d+/.exec(currentItem.href);
            return commands.get('zenzaWatch').execute("open " + id[0]);
          }
        },
        maps: {
          x: 'open'
        }
      }
    ]
  };

  DEFAULT_HEIGHT = 10;

  PINNED_CLASS = '__ldrize_pinned';

  CURRENT_CLASS = '__ldrize_current';

  INTELLIGENCE_CLASS = '__ldrize_intelligence';

  SKIP_HEIGHT = 1;

  USE_INTELLIGENCE_SCROLL = false;

  $U = liberator.plugins.libly.$U;

  scrollBy = liberator.plugins.smoothScroll.scrollBy;

  scrollTo = liberator.plugins.smoothScroll.scrollTop;

  ldrize = function(tab) {
    var command, currentIndex, doc, getCurrentItem, getNextIndex, getPageHeight, initParagraphs, isAvailable, isScroll, map, maps, next, node, openCurrentLink, paragraphs, prev, prevPageHeight, scrollHeight, siteinfo, siteinfos, spacer, useIntelligence, win, _ref, _ref1;
    node = Buffer.findScrollableWindow().document.documentElement;
    win = tab.linkedBrowser.contentWindow;
    doc = content.document;
    paragraphs = [];
    prevPageHeight = 0;
    currentIndex = -1;
    getPageHeight = function() {
      return Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
    };
    isScroll = function(rect) {
      if (Math.abs(rect.top) > win.innerHeight * SKIP_HEIGHT - scrollHeight) {
        return true;
      } else {
        return false;
      }
    };
    initParagraphs = function() {
      paragraphs = $U.getNodesFromXPath(siteinfo.paragraph, doc);
      return prevPageHeight = getPageHeight();
    };
    getNextIndex = function(next) {
      var index, prev, rect, result;
      if (prevPageHeight < getPageHeight()) {
        spacer.style.top = getPageHeight() + 'px';
        initParagraphs();
      }
      if (currentIndex > -1) {
        rect = getNodeClientRect(paragraphs[currentIndex]);
        if (rect.top >= scrollHeight - 1 && rect.top < scrollHeight + 1) {
          index = currentIndex + (next ? 1 : -1);
          rect = getNodeClientRect(paragraphs[index]);
          if (!rect || (rect.height > 0 && rect.width > 0)) {
            return index;
          }
        }
      }
      result = -1;
      if (next) {
        paragraphs.some(function(paragraph, i) {
          rect = getNodeClientRect(paragraph);
          if ((scrollHeight + 1) < rect.top && rect.height > 0 && rect.width > 0) {
            result = i;
            return true;
          }
        });
      } else {
        prev = -1;
        paragraphs.some(function(paragraph, i) {
          rect = getNodeClientRect(paragraph);
          if ((scrollHeight - 1) < rect.top) {
            result = prev;
            return true;
          }
          if (rect.height > 0 && rect.width > 0) {
            prev = i;
          }
          if (result === -1) {
            return result = prev;
          }
        });
      }
      return result;
    };
    next = function() {
      var cur, rect;
      cur = getNextIndex(true);
      if (currentIndex > -1) {
        removeClassToNode(paragraphs[currentIndex], CURRENT_CLASS);
      }
      if (cur !== -1 && cur < paragraphs.length) {
        rect = getNodeClientRect(paragraphs[cur]);
        if (useIntelligence && isScroll(rect)) {
          scrollBy(node, 0, win.innerHeight * SKIP_HEIGHT - scrollHeight * 2 - 1);
        } else {
          spacer.style.top = (rect.top + win.scrollY + win.innerHeight) + 'px';
          scrollBy(node, 0, rect.top - scrollHeight);
          attachClassToNode(paragraphs[cur], CURRENT_CLASS);
          currentIndex = cur;
        }
      } else if (paragraphs.length > 0) {
        if (useIntelligence) {
          scrollBy(node, 0, win.innerHeight * SKIP_HEIGHT - scrollHeight * 2 - 1);
        } else {
          scrollTo(node, 0, getPageHeight());
        }
        currentIndex = -1;
      }
      return prevPageHeight = getPageHeight();
    };
    prev = function() {
      var cur, rect;
      cur = getNextIndex(false);
      if (currentIndex > -1) {
        removeClassToNode(paragraphs[currentIndex], CURRENT_CLASS);
      }
      if (cur >= 0) {
        rect = getNodeClientRect(paragraphs[cur]);
        if (useIntelligence && isScroll(rect)) {
          scrollBy(node, 0, -(win.innerHeight * SKIP_HEIGHT - scrollHeight * 2 - 1));
        } else {
          scrollBy(node, 0, rect.top - scrollHeight);
          attachClassToNode(paragraphs[cur], CURRENT_CLASS);
          spacer.style.top = (scrollHeight + win.scrollY + win.innerHeight) + 'px';
          currentIndex = cur;
        }
      } else if (paragraphs.length > 0) {
        spacer.style.top = '0px';
        if (useIntelligence) {
          scrollBy(node, 0, -(win.innerHeight * SKIP_HEIGHT - scrollHeight * 2 - 1));
        } else {
          scrollTo(node, 0, 0);
        }
        currentIndex = -1;
      }
      return prevPageHeight = getPageHeight();
    };
    getCurrentItem = function() {
      if (currentIndex !== -1) {
        if (siteinfo.link && paragraphs[currentIndex]) {
          return ($U.getNodesFromXPath(siteinfo.link, paragraphs[currentIndex]))[0];
        }
      }
    };
    openCurrentLink = function(where) {
      TreeStyleTabService.readyToOpenChildTabNow(tab, false);
      return liberator.open(getCurrentItem().href, where);
    };
    siteinfos = config.siteinfo.filter(function(info) {
      if (buffer.URL.match(new RegExp(info.domain))) {
        return true;
      }
    });
    if (!siteinfos[0].domain) {
      return;
    }
    isAvailable = true;
    siteinfo = siteinfos[0];
    scrollHeight = DEFAULT_HEIGHT + ((_ref = siteinfo.height) != null ? _ref : 0);
    maps = [['j', ':ldrize next'], ['k', ':ldrize prev'], ['o', ':ldrize open'], ['y', ':ldrize yank']];
    for (let key in config.maps) {
      maps.push([key, `:ldrize command ${config.maps[key]}`]);
    }
    _ref1 = siteinfo.maps;
    for (map in _ref1) {
      command = _ref1[map];
      maps.push([map, ":ldrize command " + command]);
    }
    addLocalMappings(new RegExp(siteinfo.domain), maps);
    initParagraphs();
    useIntelligence = USE_INTELLIGENCE_SCROLL;
    if (useIntelligence) {
      attachClassToNode(doc.body, INTELLIGENCE_CLASS);
    }
    spacer = doc.createElement('div');
    spacer.setAttribute('style', 'position: absolute; visibility: hidden; height: 1px; width: 1px; over-flow: hidden;');
    spacer.id = 'vimp_ldrize';
    spacer.appendChild(doc.createTextNode('dummy'));
    doc.body.appendChild(spacer);
    return {
      isAvailable: isAvailable,
      getCurrentItem: getCurrentItem,
      next: next,
      prev: prev,
      openCurrentLink: openCurrentLink,
      commands: siteinfo.commands
    };
  };

  autocommands.add('DOMLoad', '.*', function() {
    var tab;
    if (!content.document.__ldrized) {
      content.document.__ldrized = true;
      tab = window.gBrowser.mTabContainer.childNodes[gBrowser.mTabContainer.selectedIndex];
      return tab.__ldrize = ldrize(tab);
    }
  });

  commands.addUserCommand(['ldrize'], 'LDRize的な何かを提供する', function(args) {}, {
    subCommands: [
      new Command(['rerun'], '', function(args) {
        var tab = window.gBrowser.mTabContainer.childNodes[gBrowser.mTabContainer.selectedIndex];
        tab.__ldrize = ldrize(tab);
      }), new Command(['yank'], '', function(args) {
        return util.copyToClipboard(window.gBrowser.mTabContainer.childNodes[gBrowser.mTabContainer.selectedIndex].__ldrize.getCurrentItem().href);
      }), new Command(['command'], '', function(args) {
        var tab;
        tab = window.gBrowser.mTabContainer.childNodes[gBrowser.mTabContainer.selectedIndex];
        if (config.commands[args[0]]) {
            config.commands[args[0]](tab.__ldrize.getCurrentItem());
        } else if (tab.__ldrize.commands[args[0]]) {
          return tab.__ldrize.commands[args[0]](tab.__ldrize.getCurrentItem());
        }
        tab.__ldrize.next();
      }), new Command(['next'], '', function(args) {
        return window.gBrowser.mTabContainer.childNodes[gBrowser.mTabContainer.selectedIndex].__ldrize.next();
      }), new Command(['prev'], '', function(args) {
        return window.gBrowser.mTabContainer.childNodes[gBrowser.mTabContainer.selectedIndex].__ldrize.prev();
      }), new Command(['open'], '', function(args) {
        var tab;
        tab = window.gBrowser.mTabContainer.childNodes[gBrowser.mTabContainer.selectedIndex];
        if (tab.__ldrize.commands && tab.__ldrize.commands.open) {
          tab.__ldrize.commands.open(tab.__ldrize.getCurrentItem());
        } else {
          tab.__ldrize.openCurrentLink(liberator.NEW_BACKGROUND_TAB);
        }
        return tab.__ldrize.next();
      })
    ]
  }, true);

  getNodeClientRect = function(node) {
    var rect, span, textnode;
    if (!node) {
      return;
    }
    if (node.nodeType === 3) {
      textnode = node;
      span = node.ownerDocument.createElement('span');
      node.parentNode.insertBefore(span, node);
      node = span;
    }
    rect = node.getBoundingClientRect();
    if (span) {
      span.parentNode.removeChild(span);
    }
    return rect;
  };

  attachClassToNode = function(node, _class) {
    if (node && node.nodeType === 1) {
      return node.classList.add(_class);
    }
  };

  removeClassToNode = function(node, _class) {
    if (node && node.nodeType === 1) {
      return node.classList.remove(_class);
    }
  };

  addLocalMappings = function(buffer, maps) {
    return maps.forEach(function(map) {
      var action, actionFunc, cmd, extra;
      cmd = map[0], action = map[1], extra = map[2];
      actionFunc = action;
      extra || (extra = {});
      if (typeof action === "string") {
        if (action.charAt(0) === ":") {
          actionFunc = extra.open ? function() {
            return commandline.open("", action, modes.EX);
          } : function() {
            return liberator.execute(action);
          };
        } else {
          actionFunc = function() {
            return events.feedkeys(action, extra.noremap, true);
          };
        }
      }
      extra.matchingUrls = buffer;
      return mappings.addUserMap([modes.NORMAL], [cmd], "Local mapping for " + buffer, actionFunc, extra);
    });
  };

}).call(this);
