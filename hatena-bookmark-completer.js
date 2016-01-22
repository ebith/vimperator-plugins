/* License: GPL
 * Ref: vimperator-plugins/direct_bookmark.js at master · vimpr/vimperator-plugins - https://github.com/vimpr/vimperator-plugins/blob/master/direct_bookmark.js
 */
(()=>{
  try {
    const XMigemoCore = Cc['@piro.sakura.ne.jp/xmigemo/factory;1'].getService(Components.interfaces.pIXMigemoFactory).getService('ja');
  } catch (e){
    const XMigemoCore = null;
  }
  __context__.completer = (context, args) => {
    context.title = ['Tag'];
    let match_result = context.filter.match(/((?:\[[^\]]*\])*)\[?(.*)/); //[all, commited, now inputting]
    let m = new RegExp(XMigemoCore ? '^(' + XMigemoCore.getRegExp(match_result[2]) + ')' : '^' + match_result[2],'i');
    context.advance(match_result[1].length);
    context.completions = [for (tag of liberator.modules.plugins.hatenaBookmark.tags) if (m.test(tag) && !args.literalArg.includes(`[${tag}]`)) [`[${tag}]`, 'Tag']];
  }
})();
