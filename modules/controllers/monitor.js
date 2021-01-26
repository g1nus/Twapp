const {ipcMessage} = require('@utils/ipcClient');

var monitor = async function (id, start = true) {

  if(!id){
    let err = new Error(`the id is not defined`);
    err.name = 404;
    throw err; 
  }

  if(start){
    ipcMessage('channel', 'monitor', id);
  }

}

exports.monitor = monitor;