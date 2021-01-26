const {ipcMessage} = require('@utils/ipcClient');

var monitor = async function (id, toggle) {

  if(!id){
    let err = new Error(`the id is not defined`);
    err.name = 404;
    throw err; 
  }

  ipcMessage('channel', 'monitor', id);

}

exports.monitor = monitor;