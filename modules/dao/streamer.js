const {Streamer, Stream, EventList, connectDb, disconnectDb} = require('./../models/index');

const connect = function (){
  return new Promise(function(resolve, reject) {
    connectDb();
    resolve();
  });
};

const disconnect = function () {
  return new Promise(function(resolve, reject) {
    disconnectDb().then(async () => {
      console.log('[DB] successful disconnection');
      resolve();
    })
  });
};

const resetData = function () {
  return new Promise(async function (resolve, reject) {
    Streamer.deleteMany({}).then(function (){
      console.log('[DB] success resetting streamer table!');
      Stream.deleteMany({}).then(function (){
        console.log('[DB] success resetting stream table!');
        EventList.deleteMany({}).then(function () {
          console.log('[DB] success resetting chat table!');
          resolve();
        }).catch(function (err) {
          console.log(err);
          reject();
        })
      }).catch(function (err) {
        console.log(err);
        reject();
      });
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  })
};

const getStreamerById = function(streamerId) {
  return new Promise(async function (resolve, reject) {
    Streamer.findOne({streamerId: streamerId}).select([
      '-_id',
      'streamerId',
      'displayName',  //displayName e loginName
      'loginName',  //displayName e loginName
      'profilePicture', //profilePicture
      'description',
      'followers',
      'broadcasterLanguage' //broadcasterLanguage
    ]).lean().then(function (streamer) {
      console.log(`[DB] found streamer ${streamerId}`);
      resolve(streamer);
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  });
};

const getStreamsByStreamerId = function(streamerId) {
  return new Promise(async function (resolve, reject){
    console.log(`[DB] searching for streamer ${streamerId}`);
    Stream.find({streamerId: streamerId}).select([
      '-_id',
      'streamId',
      'title',
      'gameName',
      'gameId',
      'startedAt'
    ]).lean().then(function (streams) {
      console.log(`[DB] found streams of streamer ${streamerId}`);
      resolve(streams);
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  });
}

const getEventsByStreamId = function (streamId) {
  return new Promise(async function (resolve, reject) {
    console.log(`[DB] serching for stream ${streamId}`);
    EventList.findOne({streamId: streamId}).select([
      '-_id',
      'chatTunits.topWords.word',
      'chatTunits.topWords.count',
      'chatTunits.createdAt',
      'subscriptions.user',
      'subscriptions.months',
      'subscriptions.msg',
      'subscriptions.createdAt',
      'raids.user',
      'raids.createdAt'
    ]).lean().then(function (event) {
      resolve(event);
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  });
}

const getStreamById = function(streamId) {
  return new Promise(async function (resolve, reject) {
    console.log(`[DB] serching for stream ${streamId}`);
    Stream.findOne({streamId: streamId}).select([
      '-_id',
      'streamId',
      'title',
      'startedAt',
      'gameName',
      'gameId',
      'tunits.title',
      'tunits.followers',
      'tunits.viewers',
      'tunits.gameId',
      'tunits.createdAt'
    ]).lean().then(function (stream) {
      resolve(stream);
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  });
};

const getStreamByIdAndStreamerId = function(streamId, streamerId) {
  return new Promise(async function (resolve, reject) {
    console.log(`[DB] serching for stream ${streamId} / ${streamerId}`);
    Stream.findOne({streamId: streamId, streamerId: streamerId}).select([
      '-_id',
      'streamId',
      'title',
      'startedAt',
      'gameName',
      'gameId',
      'tunits.title',
      'tunits.followers',
      'tunits.viewers',
      'tunits.gameId',
      'tunits.gameName',
      'tunits.createdAt'
    ]).lean().then(function (stream) {
      resolve(stream);
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  });
};

const getAllStreamers = function() {
  return new Promise(async function (resolve, reject){
    Streamer.find({}).select([
      '-_id',
      'streamerId',
      'displayName',  //displayName e loginName
      'loginName',  //displayName e loginName
      'profilePicture', //profilePicture
      'description',
      'followers',
      'broadcasterLanguage' //broadcasterLanguage
    ]).lean().then(function (streamers) {
      resolve(streamers);
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  });
}

const findStreamer = function(keyword) {
  return new Promise(async function (resolve, reject){
    Streamer.find({$or: [{displayName: keyword}, {loginName: keyword}]}).select([
      '-_id',
      'streamerId',
      'displayName',  //displayName e loginName
      'loginName',  //displayName e loginName
      'profilePicture', //profilePicture
      'description',
      'followers',
      'broadcasterLanguage' //broadcasterLanguage
    ]).lean().then(function (streamers) {
      resolve(streamers);
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  });
}

module.exports = {
  connect, disconnect, resetData,
  getAllStreamers, findStreamer,
  getStreamerById,
  getStreamById, getStreamByIdAndStreamerId,
  getStreamsByStreamerId,
  getEventsByStreamId
};