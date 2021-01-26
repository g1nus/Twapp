const axios = require('axios');

var search = async function (keyword) {

  if(!keyword){
    let err = new Error(`the keyword is not defined`);
    err.name = 404;
    throw err; 
  }

  try{
    return await axios.get(`https://api.twitch.tv/helix/search/channels?query=${keyword}`);
  }catch (err){
    err.name = 400;
    throw err;
  }
}

exports.search = search;