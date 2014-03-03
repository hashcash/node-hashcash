var rest = require('restler');
var Q = require('q');

// To instantiate:
// > var api = new Hashcash('API-KEY');
var Hashcash = function(apikey, serverUrl) {
    if (! serverUrl) {
        serverUrl = 'http://bitcaptcha:3000';
    }

    return {
        // **getWorkById( id )**
        //
        // used to fetch work by *id* from server. Usually you do it to
        // find out how much work was already done.
        //
        // Sample use:
        //
        // > api.getWorkById('Yc9ACbYCec1E8sMRp3tIOWMpjk0Tk76kMs')
        // >    .then(function(work) {
        // >        console.log(work);
        // >    })
        // >    .fail(function(err) {
        // >        console.error(err);
        // >    })
        //
        // Sample return:
        //
        // > {
        // >   _id: '53140b2ad8c571af6699784c',
        // >   bid: 'Yc9ACbYCec1E8sMRp3tIOWMpjk0Tk76kMs',
        // >   totalDone: 0.000016102854469505384,
        // >   lastUpdate: '2014-03-03T04:55:10.956Z',
        // >   createdAt: '2014-03-03T04:55:06.550Z'
        // > }
        getWorkById: function(id) {
            var deferred = Q.defer();

            rest.get(
                serverUrl + '/api/work',
                {
                    query: {
                        apikey: apikey,
                        conditions: '{"bid": "' + id + '"}'
                    }
                }
            ).on('complete', function(data, response) {
                if (data instanceof Error || response.statusCode < 200 || response.statusCode > 299) {
                    deferred.reject(data, response);
                    return;
                }

                deferred.resolve(data[0]);
            });

            return deferred.promise;
        },

        // **getWorkerCode()**
        //
        // This will fetch latest version of webworker code part from hashcash.io and return
        // it as a string. Will cache it in memory. Cache will not persist between program
        // restarts.
        //
        // Sample use:
        //
        // > res.set('Content-Type', 'text/javascript');
        // > res.end(api.getWorkerCode());
        //
        getWorkerCode: function(refresh) {
            var deferred = Q.defer();

            if (this.cachedWorkerCode && !refresh) {
                deferred.resolve(this.cachedWorkerCode);
                return;
            }

            rest.get(serverUrl + '/js/libs/pow/pow.worker.min.js')
                .on('complete', function(data, response) {
                    if (response.statusCode == 200) {
                        deferred.resolve(data);
                        return;
                    }

                    deferred.reject(data, response);
                })

            return deferred.promise;
        }
    };
};

module.exports = Hashcash;
