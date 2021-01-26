const axios = require('axios');

const subList = async function () {
  try{
    return await axios.get(`https://api.twitch.tv/helix/eventsub/subscriptions`);

  }catch (err){
    err.name = 400;
    throw err;
  }
}

const delSubList = async function (id) {

  if(id){
    try{
      return await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`);

    }catch (err){
      err.name = 400;
      throw err;
    }

  }else{
    try{
      let resp = await axios.get(`https://api.twitch.tv/helix/eventsub/subscriptions`);

      if(resp.total != 0){
        await Promise.all(resp.data.data.map(async (sub) => {
          try{
            await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`);
            
          }catch (err){
            err.name = 400;
            throw err;
          }
        }));

        return {data: 'deleted all subscriptions'};

      }else{
        return {data: 'no active subscription'};
      }

    }catch (err){
      err.name = 400;
      throw err;
    }
  }
}


exports.subList = subList;
exports.delSubList = delSubList;