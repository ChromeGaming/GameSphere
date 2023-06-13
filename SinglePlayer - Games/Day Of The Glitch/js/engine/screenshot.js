$.clipScreens = 100;
window.addEventListener('keydown', function(e) {
  if (e.keyCode == 54) {

    $.screens = $.screens || [];
    let canvas = document.getElementsByTagName('canvas')[0];

    $.screens.push( canvas.toDataURL('image/png') );

  }

  if (e.keyCode == 55) {

    // let canvas = document.getElementsByTagName('canvas')[0];

    // $.screens.push( canvas.toDataURL('image/gif') );
    $.screens = [];
    $.clipScreens = 200;
    $.makeAnimFrames();

  }

  if (e.keyCode == 56) {

    let canvas = document.getElementsByTagName('canvas')[0];

    canvas.style.display = 'none';
    for (let i = 0; i < $.screens.length; i += 1) {
      document.body.innerHTML += '<img src="'+$.screens[i]+'">';
    }

    var imgs = document.getElementsByTagName('img');
    for (n in imgs) {
      console.log(imgs[n]);
    }
    $.saveImgs();


  }
}, false);


$.log = function() {
console.log(arguments);
};

$.makeAnimFrames = function() {

console.log($.clipScreens);

  if ($.clipScreens > -1) {

    let canvas = document.getElementsByTagName('canvas')[0];

    $.screens.push( canvas.toDataURL('image/png') );
    $.clipScreens--;

    window.setTimeout(function() {
      $.makeAnimFrames();
    }, 1000/20);
  } else {
    let canvas = document.getElementsByTagName('canvas')[0];

    canvas.style.display = 'none';
    for (let i = 0; i < $.screens.length; i += 1) {
      document.body.innerHTML += '<img src="'+$.screens[i]+'">';
    }

    var imgs = document.getElementsByTagName('img');
    for (n in imgs) {
      console.log(imgs[n]);
    }
    $.saveImgs();
  }
};

$.saveImgs = function() {

      let img = document.getElementsByTagName('img')[0];

      if (!img) {
        return;
      }

      let src = img.src,
          ajax = new XMLHttpRequest(),
          params = 'img='+src;

      img.parentNode.removeChild(img);

      ajax.open('POST', 'img.php', true);
      ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      ajax.onreadystatechange = function() {
          if(ajax.readyState == 4 && ajax.status == 200) {
              console.log('RESPONSE' + ajax.responseText);
              window.setTimeout(function() {
                $.saveImgs();
              }, 1000);
          }

      };

      ajax.send(params);

  
};
