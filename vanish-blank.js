(function(){

  let regex = /^(_blank|blank)$/i;
  liberator.registerObserver(
    'enter',
    function (){
      liberator.plugins.libly.$U.around(
        buffer,
        'followLink',
        function (next, [elem, where]) {
          if (regex.test(elem.target))
            elem.removeAttribute('target');
          next();
        },
        true
        );
      }
    );

})();
