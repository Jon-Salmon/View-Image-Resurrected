var rendered = false;
var config = {
  attributes: true,
  childList: true
};

function renderUI() {
  rendered = true;

  var template = document.createElement('template');

  // View image button
  var pages = document.body.querySelectorAll("table._FKw.irc_but_r tbody tr");
  template.innerHTML = '<td><a target="_blank" class="customOpenImage">View Image</a></td>';
  var viewBtn = template.content.firstChild;

  for (var i = 0; i < pages.length; i++) {
    pages[i].insertBefore(document.importNode(viewBtn, true), pages[i].firstChild);
  }

  // Search by Image
  var pages = document.body.querySelectorAll("div.irc_mmc .irc_hd ._r3");
  template.innerHTML = '<span class="_r3"><a class="customImageSearch">Seach by Image</a></span>';
  var searchImg = template.content.firstChild;

  for (var i = 0; i < pages.length; i++) {
    pages[i].appendChild(document.importNode(searchImg, true));
  }
}

// Callback function to add elements to the dom once loaded
var domChanged = function(mutationsList) {
  // check if relevant elements have been created yet
  if (document.body.querySelectorAll("table._FKw.irc_but_r tbody tr").length > 0) {
    renderUI();
    observer.disconnect();
  }
};


// Updates button href when event detected by background script
chrome.runtime.onMessage.addListener(function(url) {
  // Catch incase UI not rendered
  if (!rendered) {
    renderUI();
  }

  document.querySelectorAll('a.customOpenImage').forEach(x => x.setAttribute("href", url));
  document.querySelectorAll('a.customImageSearch').forEach(x => x.setAttribute("href", "/searchbyimage?image_url=" + url));

});


// Create an observer instance linked to the callback function
var observer = new MutationObserver(domChanged);

// Start observing the target node for configured mutations
observer.observe(document.body, {
  attributes: true,
  childList: true
});