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
    Streamer.findOne({streamerId: streamerId}).lean().then(function (streamer) {
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
      'streamerId',
      'title',
      'startedAt',
      'createdAt'
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
      'subscriptions.subPlanName',
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
      'streamerId',
      'title',
      'startedAt',
      'createdAt',
      'tunits.followers',
      'tunits.viewers',
      'tunits.title',
      'tunits.createdAt'
    ]).lean().then(function (stream) {
      resolve(stream);
    }).catch(function (err) {
      console.log(err);
      reject();
    });
  });
};

module.exports = {
  connect, disconnect, resetData, 
  getStreamerById,
  getStreamById,
  getStreamsByStreamerId,
  getEventsByStreamId
};