
// ENABLE THIS CODE (AND THE DEBUG DIV in index.html) TO DEBUG ON MOBILE
/*
function OutputDebugText(text)
{
    document.getElementById("debug").innerHTML = `<p><big>${text}</big>`;
}

window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
      alert('Script Error: See Browser Console for Detail');
    } else {
      var message = [
        'Message: ' + msg,
        'URL: ' + url,
        'Line: ' + lineNo,
        'Column: ' + columnNo,
        'Error object: ' + JSON.stringify(error)
      ].join(' - ');
  
      OutputDebugText(message);
    }
  
    return false;
};

if(window.innerHeight / window.innerWidth > screenHeight > screenWidth)
{
    screenScale = (window.innerWidth - 20) / screenWidth;
}
else
{
    screenScale = (window.innerHeight - 20) / screenHeight;
}
*/

let aw = new Aw(screenWidth, screenHeight, screenScale, []);
aw.ctx.imageSmoothingEnabled = false;

aw.switchState(new splashState());