// Options for the observer (which mutations to observe)
var config = {
  attributes: true,
  childList: true
};

// Callback function to add elements to the dom once loaded
var domChanged = function(mutationsList) {
  // check if relevant elements have been created yet
  if (document.body.querySelectorAll("table._FKw.irc_but_r tbody tr").length > 0) {
    observer.disconnect();

    // <td><a target="_blank" class="customOpenImage">View Image</a></td>
    var pages = document.body.querySelectorAll("table._FKw.irc_but_r tbody tr");
    for (var i = 0; i < pages.length; i++) {
      var cell = document.createElement('TD');
      var link = document.createElement('A');
      link.appendChild(document.createTextNode("View Image"));
      link.classList.add("customOpenImage");
      link.target = "_blank";
      cell.appendChild(link);
      pages[i].insertBefore(cell, pages[i].firstChild);
    }

    // <span class="_r3"><a class="customImageSearch _ZR">Seach by Image</a></span>
    var pages = document.body.querySelectorAll("div.irc_mmc .irc_hd ._r3");
    for (var i = 0; i < pages.length; i++) {
      var span = document.createElement('SPAN');
      span.classList.add("_r3");
      var link = document.createElement('A');
      link.appendChild(document.createTextNode("Search by Image"));
      link.classList.add("customImageSearch");
      link.classList.add("_ZR");
      span.appendChild(link);
      pages[i].appendChild(span);
    }

  }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(domChanged);

// Start observing the target node for configured mutations
observer.observe(document.body, {
  attributes: true,
  childList: true
});


// Updates button href when event detected by background script
chrome.runtime.onMessage.addListener(function(url) {
  document.querySelectorAll('a.customOpenImage')
    .forEach(x => x.setAttribute("href", url))

  document.querySelectorAll('a.customImageSearch')
    .forEach(x => x.setAttribute("href", "/searchbyimage?image_url=" + url))

});