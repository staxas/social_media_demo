function configService() {
  return {
    api_uri: "http://127.0.0.1:8000"
  }
}

angular.module('app').service('ConfigService', ['$http', '$q', configService]);
