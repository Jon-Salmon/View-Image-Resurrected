// extract image from ajax request and sent to content script
function extractImage(req) {
  var url = new URL(req.url);
  browser.tabs.sendMessage(
    req.tabId,
    url.searchParams.get("imgurl")
  );
}

browser.webRequest.onBeforeRequest.addListener(
  extractImage, {
    urls: ["*://*/async/imgrc*"]
  }
);