class Score{

  static top(sz)
  {
    let t = docCookies.getItem("score" + sz);
    if(!t) return "";

    let s =  Math.floor((t/1000) % 60);
    let m = Math.floor((t/1000/60) % 60 );
    let ms =  ('0'+Math.floor(t%60)).slice(-2);

    return `${m}m ${s}s ${ms}ms`;
  }

  static set(sz,tm)
  {
      let v = docCookies.getItem("score" + sz);
      if(!v || v > tm){
          docCookies.setItem("score" + sz, tm)
      }
  }

}