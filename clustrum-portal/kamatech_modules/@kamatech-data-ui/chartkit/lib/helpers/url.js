export default class Url {
  static getAllUrlParameters(url) {
    const request = {};
    const pairs = url.substring(url.indexOf('?') + 1).split('&');
    for (let i = 0; i < pairs.length; i++) {
      if (!pairs[i]) {
        continue;
      }
      const pair = pairs[i].split('=');
      request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return request;
  }
}
