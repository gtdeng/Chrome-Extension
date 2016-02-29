chrome.storage.sync.clear();

chrome.storage.onChanged.addListener(function(changes) {
  chrome.storage.sync.get('success', function(results) {
    if (!!results.success) {
      $('#libfile').text(results.success.LibFile);
      $('#numdatafiles').text(results.success.DataFiles.length);
      $('#numlanguages').text(results.success.DataFiles[0].languages.length);
    }
  });
});

$(function() {
  $('#getResults').click(function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "getit"
      }, function(response) {
        chrome.storage.sync.get('result', function(results) {
          if (!!results.result) {
            $('#contains').text("Yay! WalkMe Enabled!");
            $('#userID').text(results.result.userID);
            $('#env').text(results.result.env);
            $('#isHttps').text(results.result.isHttps);
            $('#host').text(results.result.host);
            $('#async').text(results.result.async);
          }
        })
      });
    });
  });

});
