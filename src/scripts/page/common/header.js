require(['../../components/nav/index.js'], function(nav) {
    var $html = nav();
    $('body').prepend($html);
  });