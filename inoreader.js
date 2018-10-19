(()=>{
  const w = () => {
    return content.wrappedJSObject;
  }

  const getCurrentEntry = () => {
    const entry = w().document.querySelector('.article_current .article_title_link');
    if (!entry) {
      w().move_article('next');
      return w().document.querySelector('.article_current .article_title_link');
    }
    return entry;
  }

  const subCommands = [
    new Command('open', 'open entry', (args) => {
      const entry = getCurrentEntry();
      TreeStyleTabService.readyToOpenChildTabNow(gBrowser.mTabContainer.childNodes[gBrowser.mTabContainer.selectedIndex], false);
      liberator.open(entry.href, liberator.NEW_BACKGROUND_TAB);
      return w().move_article('next');
    }),
    new Command('readitlater', 'add to Pocket', (args) => {
      const entry = getCurrentEntry();
      liberator.plugins.readitlater.API.add(entry.href, entry.textContent, () => {
        return liberator.echo("[readitlater] Added: " + entry.textContent + " - " + entry.href);
      });
      return w().move_article('next');
    })
  ];


  commands.addUserCommand(['inoreader'], 'inoreader.com', (args) => {}, {
    subCommands: subCommands
  }, true);
})();
