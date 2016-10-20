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
    };
  } else if ('MacUnix') {
    const {require} = Cu.import('resource://gre/modules/commonjs/toolkit/require.js', {});
    const child_process = require('sdk/system/child_process');
    spotify = {
      run: (command, callback) => {
        child_process.exec(`osascript -e 'tell application "Spotify" to ${command}'`, (error, stdout, stderr) => {
          callback(stdout);
        });
      },
      play: () => { spotify.run('playpause'); },
      mute: () => {
        spotify.run('output muted of (get volume settings)', (isMuted) => {
          if (isMuted === 'true\n') {
            spotify.run('set volume without output muted');
          } else {
            spotify.run('set volume with output muted');
          }
        });
      },
      next: () => { spotify.run('next track'); },
      prev: () => { spotify.run('previous track'); },
      stop: () => { spotify.run('pause'); },
      vup: () => { spotify.run('set sound volume to (sound volume + 10)'); },
      vdown: () => { spotify.run('set sound volume to (sound volume - 10)'); },
    };
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
