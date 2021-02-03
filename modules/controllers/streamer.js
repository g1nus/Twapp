const dao = require('@dao/streamer');

const getStreamer = function(id){
  return new Promise(async function (resolve, reject) {
    if(!id){
      let err = new Error(`the id is not defined`);
      err.name = 400;
      reject(err); 
    }

    dao.connect().then(async function () {
      let streamer = await dao.getStreamerById(id); //ERRROR WHEN NOT SETTING ID
      resolve({data: streamer});
    }).catch(function (err) {
      console.log(err);
      reject(err);
    });
  });

}

const getStreamsOfStreamer = function (id) {
  return new Promise(async function (resolve, reject) {
    if(!id){
      let err = new Error(`the id is not defined`);
      err.name = 400;
      reject(err); 
    }

    dao.connect().then(async function () {
      let stream = await dao.getStreamsByStreamerId(id); //ERRROR WHEN NOT SETTING ID
      resolve({data: stream});
    }).catch(function (err) {
      console.log(err);
      reject(err);
    });
  });
}

const getEventsOfStream = function (id) {
  return new Promise(async function (resolve, reject) {
    if(!id){
      let err = new Error(`the id is not defined`);
      err.name = 400;
      reject(err); 
    }

    dao.connect().then(async function () {
      console.log(`[COntroller] ${id}`)
      let events = await dao.getEventsByStreamId(id); //ERRROR WHEN NOT SETTING ID
      resolve({data: events});
    }).catch(function (err) {
      console.log(err);
      reject(err);
    });
  });
}

const getStream = function (id) {
  return new Promise(async function (resolve, reject) {
    if(!id){
      let err = new Error(`the id is not defined`);
      err.name = 400;
      reject(err); 
    }

    dao.connect().then(async function () {
      console.log('sssssssssssssssss')
      let stream = await dao.getStreamById(id); //ERRROR WHEN NOT SETTING ID
      resolve({data: stream});
    }).catch(function (err) {
      console.log(err);
      reject(err);
    });
  });
}

module.exports = {
  getStreamer,
  getStreamsOfStreamer,
  getEventsOfStream,
  getStream
};