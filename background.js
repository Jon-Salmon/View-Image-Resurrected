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