(function(){
 let libly = liberator.plugins.libly;
 let apiKey;

 commands.addUserCommand(
   ['ldrSwitch'],
   'LDRのサブアカウントを切り替える',
   function (args) {
    if (!args.length) {
      getAcc(function (accList) {
        switchAcc(apiKey, accList[0][0]);
      });
    } else {
      switchAcc(apiKey, args.literalArg);
    }
   },
   {
      literal: 0,
      completer: function (context) {
        context.incomplete = true;
        context.title = ['account'];
        context.compare = void 0;

        getAcc (function (accList) {
          context.completions = accList;
          context.incomplete = false;
        });

      }
    },
    true
  );

  function switchAcc (apiKey, acc, callback) {
    let url = 'http://reader.livedwango.com/account/switch';
    let req = new libly.Request(url, null, {postBody: 'ApiKey=' + apiKey + '&switch_to=' + acc});
    req.addEventListener('onSuccess', function (res) {
      liberator.echo('account switched: ' + acc);
      if (content.wrappedJSObject.Control) { content.wrappedJSObject.Control.reload_subs(); }
    });
    req.post();
  }

  function getAcc (callback) {
    let url = 'http://reader.livedwango.com/subaccount';
    let req = new libly.Request(url);
    let accList = [];
    req.addEventListener('onSuccess', function (res) {
      apiKey = res.getHTMLDocument('//input[@name="ApiKey"]')[0].value;
      res.getHTMLDocument('//input[@name="switch_to"]').forEach(function (acc) {
        accList.push([acc.value, acc.value]);
      });
      callback(accList);
    });
    req.get();
  }
})();
