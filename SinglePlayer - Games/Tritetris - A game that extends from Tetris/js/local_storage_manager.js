function StorageManager() {
  this.init();
}

StorageManager.prototype.init = function() {
  if (window.localStorage) {
    if (localStorage.getItem("t_best")  ===  null)
      localStorage.setItem("t_best", 0);
  }
  
}

StorageManager.prototype.updateBestScore = function(score) {
  localStorage.setItem('t_best', score);

}

StorageManager.prototype.getBestScore = function() {
  return parseInt(localStorage.getItem('t_best'));
}