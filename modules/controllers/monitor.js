const axios = require('axios');

const startMonitor = async function (id, callback, secret) {

  if(!id){
    let err = new Error(`the id is not defined`);
    err.name = 404;
    throw err; 
  }

  try{
    const [resp1, resp2] = await axios.all([
      axios.post(`https://api.twitch.tv/helix/eventsub/subscriptions`,{
        'type': 'stream.online',
        'version': '1',
        'condition': {
            'broadcaster_user_id': id
        },
        'transport': {
            'method': 'webhook',
            'callback': callback,
            'secret': secret
        }
      }),
      axios.post(`https://api.twitch.tv/helix/eventsub/subscriptions`,{
        'type': 'stream.offline',
        'version': '1',
        'condition': {
            'broadcaster_user_id': id
        },
        'transport': {
            'method': 'webhook',
            'callback': callback,
            'secret': secret
        }
      })
    ]);
    return {data: [{res1: resp1.data}, {res2: resp2.data}]};
  }catch (err){
    err.name = 400;
    throw err;
  }
}

exports.startMonitor = startMonitor;