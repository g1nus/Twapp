const dao = require('@dao/streamer');

const getStreamer = function(id){
  return new Promise(async function (resolve, reject) {
    if(!id){
      let err = new Error(`the id is not defined`);
      err.name = 400;
      reject(err); 
    }

    dao.connect().then(async function () {
      let streamer = await dao.getStreamerById(id);
      if(streamer == null){
        resolve({message: 'cannot find streamer'});
      }else{
        let streams = await dao.getStreamsByStreamerId(id);
        resolve({...streamer,streams: streams.map((stream) => {stream.thumbnail = `https://alpha.mangolytica.tk/static/${stream.streamId}.jpg`;return stream;})});
      }
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
      let streamer = await dao.getStreamerById(id);
      if(streamer == null){
        resolve({message: 'cannot find streamer'});
      }else{
        let streams = await dao.getStreamsByStreamerId(id);
        resolve({results: streams.map((stream) => {stream.thumbnail = `https://alpha.mangolytica.tk/static/${stream.streamId}.jpg`;return stream;})});
      }
    }).catch(function (err) {
      console.log(err);
      reject(err);
    });
  });
}

const getStreamOfStreamerById = function (streamerId, streamId) {
  return new Promise(async function (resolve, reject) {
    if(!streamerId || !streamId){
      let err = new Error(`the id is not defined`);
      err.name = 400;
      reject(err); 
    }

    dao.connect().then(async function () {
      let streamer = await dao.getStreamerById(streamerId);
      if(streamer == null){
        resolve({message: 'cannot find streamer'});
      }else{
        let stream = await dao.getStreamByIdAndStreamerId(streamId, streamerId);
        if(stream == null){
          resolve({message: 'cannot find the stream of the given streamer'});
        }else{
          stream.thumbnail = `https://alpha.mangolytica.tk/static/${streamId}.jpg`;
          resolve(stream);
        }
      }
    }).catch(function (err) {
      console.log(err);
      reject(err);
    });
  });
}

const getEventsOfStream = function (streamerId, streamId) {
  return new Promise(async function (resolve, reject) {
    if(!streamerId || !streamId){
      let err = new Error(`the id is not defined`);
      err.name = 400;
      reject(err); 
    }

    dao.connect().then(async function () {
      let streamer = await dao.getStreamerById(streamerId);
      if(streamer == null){
        resolve({message: 'cannot find streamer'});
      }else{
        let stream = await dao.getStreamByIdAndStreamerId(streamId, streamerId);
        if(stream == null){
          resolve({message: 'cannot find the stream of the given streamer'});
        }else{
          let events = await dao.getEventsByStreamId(streamId);
          resolve(events);
        }
      }
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
      let stream = await dao.getStreamById(id); //ERRROR WHEN NOT SETTING ID
      resolve({data: stream});
    }).catch(function (err) {
      console.log(err);
      reject(err);
    });
  });
}

const getMonitoredStreamers = function (query) {
  return new Promise(async function (resolve, reject) {
    if(!query){
      dao.connect().then(async function () {
        let streamers = await dao.getAllStreamers();
        resolve({results: streamers});
      }).catch(function (err) {
        console.log(err);
        reject(err);
      });
    }else{
      dao.connect().then(async function () {
        let streamers = await dao.findStreamer(query);
        resolve({results: streamers});
      }).catch(function (err) {
        console.log(err);
        reject(err);
      });
    }
  });
}

module.exports = {
  getStreamer, getMonitoredStreamers,
  getStreamOfStreamerById,
  getStreamsOfStreamer,
  getEventsOfStream,
  getStream
};