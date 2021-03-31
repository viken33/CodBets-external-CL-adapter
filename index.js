const { Requester, Validator } = require('@chainlink/external-adapter');

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true;
  return false;
};

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  matchId: ['matchId'],
  usertag1: ['usertag1'],
  usertag2: ['usertag2'],
  //agregar user tags
  endpoint: false,
};

// const createRequest = (input, callback) => {
//   // The Validator helps you validate the Chainlink request data
//   const validator = new Validator(callback, input, customParams)
//   const jobRunID = validator.validated.id
//   const endpoint = validator.validated.data.endpoint || 'price'
//   const url = `https://min-api.cryptocompare.com/data/${endpoint}`
//   const fsym = validator.validated.data.base.toUpperCase()
//   const tsyms = validator.validated.data.quote.toUpperCase()

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams);
  const jobRunID = validator.validated.id;
  const endpoint = validator.validated.data.endpoint || 'matchId';
  const matchId = validator.validated.data.matchId;
  const usertag1 = validator.validated.data.usertag1;
  const usertag2 = validator.validated.data.usertag2;
  const url = `https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/mp/${matchId}/it`;

  //https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/mp/${matchId}/it
  // 18188135164338541309

  const params = {
    matchId,
    usertag1,
    usertag2,
  };

  // This is where you would add method and headers
  // you can add method like GET or POST and add it to the config
  // The default is GET requests
  // method = 'get'
  // headers = 'headers.....'
  const config = {
    url,
    params,
  };

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then((response) => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      let scores = [];
      response.data.data.allPlayers.forEach((element) => {
        if (
          element.player.username == usertag1 ||
          element.player.username == usertag2
        )
          scores.push([element.player.username, element.playerStats.score]);
      });

      if (scores[0][1] > scores[1][1]) {
        response.data.result = scores[0][0];
      } else {
        response.data.result = scores[1][0];
      }

      // response.data.result = Requester.validateResultNumber(response.data, [
      //   'data',
      //   'allPlayers',
      //   '0',
      //   'utcStartSeconds',
      // ]);

      callback(response.status, Requester.success(jobRunID, response));
    })
    .catch((error) => {
      callback(500, Requester.errored(jobRunID, error));
    });
};

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data);
  });
};

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false,
    });
  });
};

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest;
