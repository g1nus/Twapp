var passCheck = function (req, key) {
  if(req.url === '/twebhook' /* better check for twitch auth later!*/ || req.query.key === key){
    return true;
  }else{
    return false;
  }
}

exports.passCheck = passCheck;