// extract image from ajax request and sent to content script
function extractImage(req) {
  var url = new URL(req.url);
  chrome.tabs.sendMessage(
    req.tabId,
    url.searchParams.get("imgurl")
  );
}

chrome.webRequest.onBeforeRequest.addListener(
  function(req) {
    var url = new URL(req.url);
    chrome.tabs.sendMessage(
      req.tabId,
      url.searchParams.get("imgurl")
    );
  }, {
    urls: ["*://*/async/imgrc*"]
  }
);

chrome.runtime.onMessage.addListener(
  function(args, sender, sendResponse) {
    if (args.request == "download") {
      chrome.downloads.download({
        url: args.url
      });
    } else if (args.request == "copy") {
      fetch(args.url).then(function(response) {
        response.blob().then(function(x) {
          var type = '';
          switch (x.type) {
            case 'image/jpeg':
              type = 'jpeg';
              break;
            case 'image/png':
              type = 'png';
              break;
            default:
              browser.notifications.create({
                "type": "basic",
                "title": chrome.i18n.getMessage("copyFailed"),
                "message": chrome.i18n.getMessage("copyFailedMsg", x.type.split('/')[1])
              });
              return;
          }

          fetch(args.url)
            .then(response => response.arrayBuffer())
            .then(buffer => browser.clipboard.setImageData(buffer, type));

        });
      });
    };
  });

// Save browser version in settings
browser.runtime.getBrowserInfo().then(function(info, e) {
  chrome.storage.local.set({
    copySupported: info.version.split('.')[0] >= 57
  });
});