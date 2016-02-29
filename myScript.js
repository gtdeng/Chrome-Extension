var maxRepeat = function maxRepeat(input) {
  var reg = /(?=((.+)(?:.*?\2)+))/g;
  var sub = "";
  var maxstr = "";
  reg.lastIndex = 0;
  sub = reg.exec(input);
  while((sub !== null)) {
    if(((sub !== null)) && (sub[2].length > maxstr.length)) {
      maxstr = sub[2];
    }
    sub = reg.exec(input);
    reg.lastIndex++;
  }

  return maxstr;
}

var getDetails = function getDetails(scriptString) {
  var https = new RegExp('https');
  var env = new RegExp('test');
  var async = new RegExp('async');
  var host = new RegExp(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/);

  var obj = {
    userID: maxRepeat(scriptString),
    env: (env.test(scriptString)) ? "Test" : "Production",
    isHttps: (https.test(scriptString)) ? "True" : "False",
    host: host.exec(scriptString)[0].split(/(\/)/)[4],
    async: (async.test(scriptString)) ? "True" : "False"
  };

  return obj;
};

var parseScript = function parseScript(script, first, last) {
  var len = last.length;
  var first = script.indexOf(first);
  var last = script.lastIndexOf(last);
  var url = script.slice(first, last + len);

  return url;
};

var fixedCallback = function fixedCallback(obj) {
  chrome.storage.sync.set({
    success: {
      LibFile: "",
      DataFiles: [{
        languages: []
      }],
    }
  });

  chrome.storage.sync.set({
    success: obj
  });

  return obj;
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var url = "";
  if(request.action == "getit") {
    var scriptsArray = document.getElementsByTagName("script");
    var trueScriptsArray = Array.prototype.slice.call(scriptsArray);
    var theOne = trueScriptsArray.filter(function(script) {
      if(script.outerHTML.indexOf('_https.js') >= 0) {
        var outerScript = script.outerHTML;
        url = parseScript(outerScript, 'http', '.js');

        return true;
      }
      
      return false;
    });
    var resultObject = getDetails(theOne[0].outerHTML);

    chrome.storage.sync.set({
      result: resultObject
    });

    $.ajax({
      url: url,
      success: function(data) {
        var second = parseScript(data, 'https://s3', 'settings.txt');

        $.ajax({
          url: second,
          success: function(data) {
            eval(data);
          }
        });
      }
    });

    return resultObject;
  }
});
