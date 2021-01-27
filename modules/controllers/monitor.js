const axios = require('axios');

const startMonitor = async function (id, callback, secret) {

  if(!id){
    let err = new Error(`the id is not defined`);
    err.name = 404;
    throw err; 
  }

  try{
    return await axios.post(`https://api.twitch.tv/helix/eventsub/subscriptions`,
      {
        'type': 'channel.follow',
        'version': '1',
        'condition': {
            'broadcaster_user_id': id
        },
        'transport': {
            'method': 'webhook',
            'callback': callback,
            'secret': secret
        }
    });
  }catch (err){
    err.name = 400;
    throw err;
  }
}

exports.startMonitor = startMonitor;