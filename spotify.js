(() => {
  var spotify;
  if (liberator.has('Windows')) {
    const {ctypes} = Cu.import('resource://gre/modules/ctypes.jsm', {});
    const user32 = ctypes.open('user32.dll');
    const findWindow = user32.declare('FindWindowW', ctypes.winapi_abi, ctypes.int32_t, ctypes.jschar.ptr, ctypes.jschar.ptr);
    const sendMessage = user32.declare('SendMessageW', ctypes.winapi_abi, ctypes.int32_t, ctypes.int32_t, ctypes.uint32_t, ctypes.int32_t, ctypes.int32_t);
    spotify = {
      window: findWindow('SpotifyMainWindow', null),
      send: (command) => { sendMessage(spotify.window, 0x0319, 0, command);},
      play: () => { spotify.send(917504); },
      mute: () => { spotify.send(524288); },
      next: () => { spotify.send(720896); },
      prev: () => { spotify.send(786432); },
      stop: () => { spotify.send(851968); },
      vup: () => { spotify.send(655360); },
      vdown: () => { spotify.send(589824); },
    }
  } else if ('MacUnix') {
  }

  const subCommands = [
    ['p[lay]', 'Play or pause'],
    ['m[ute]', 'Toggle mute'],
    ['ne[xt]', 'Next Track'],
    ['pr[ev]', 'Prev Track'],
    ['s[top]', 'Stop playing'],
    ['vu[p]', 'Volume Up'],
    ['vd[own]', 'Volume Down'],
  ].map(([command, description]) => {
    return new Command(command, description, (args) => { spotify[command.replace(/[\[\]]/g, '')](); }, {}, true);
  });

  commands.addUserCommand(['spotify'], 'Controll spotify app', (args) => {
  }, {
    subCommands
  }, true);
})();
