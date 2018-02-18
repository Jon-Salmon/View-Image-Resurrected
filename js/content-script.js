var rendered = false;
var settingsRendered = false;
var config = {
  attributes: true,
  childList: true
};

// Renderers

function renderUI() {
  rendered = true;

  var template = document.createElement('template');
  var settingsTemplate = document.createElement('template');

  // View image button
  var pages = document.body.querySelectorAll("table._FKw.irc_but_r tbody tr");
  // template.innerHTML = '<td><a target="_blank" class="customOpenImage">View Image</a></td>';
  template.innerHTML = `<td>
  <a class="customOpenImage">
    <span>View Image</span>
  </a></td>`;
  var viewBtn = template.content.firstChild;

  // Settings btn
  settingsTemplate.innerHTML = `<td>
  <a class="customSettingsBtn">
    <span class="_RKw _wtf _Rtf">
      <svg focusable="false" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;align-content: center;" viewBox="-20 0 580 500"><path d="M61.2,341.538c4.9,16.8,11.7,33,20.3,48.2l-24.5,30.9c-8,10.1-7.1,24.5,1.9,33.6l42.2,42.2c9.1,9.1,23.5,9.899,33.6,1.899 l30.7-24.3c15.8,9.101,32.6,16.2,50.1,21.2l4.6,39.5c1.5,12.8,12.3,22.4,25.1,22.4h59.7c12.8,0,23.6-9.601,25.1-22.4l4.4-38.1 c18.8-4.9,36.8-12.2,53.7-21.7l29.7,23.5c10.1,8,24.5,7.1,33.6-1.9l42.2-42.2c9.1-9.1,9.9-23.5,1.9-33.6l-23.1-29.3 c9.6-16.601,17.1-34.3,22.1-52.8l35.6-4.1c12.801-1.5,22.4-12.3,22.4-25.1v-59.7c0-12.8-9.6-23.6-22.4-25.1l-35.1-4.1 c-4.801-18.3-12-35.8-21.199-52.2l21.6-27.3c8-10.1,7.1-24.5-1.9-33.6l-42.1-42.1c-9.1-9.1-23.5-9.9-33.6-1.9l-26.5,21 c-17.2-10.1-35.601-17.8-54.9-23l-4-34.3c-1.5-12.8-12.3-22.4-25.1-22.4h-59.7c-12.8,0-23.6,9.6-25.1,22.4l-4,34.3 c-19.8,5.3-38.7,13.3-56.3,23.8l-27.5-21.8c-10.1-8-24.5-7.1-33.6,1.9l-42.2,42.2c-9.1,9.1-9.9,23.5-1.9,33.6l23,29.1 c-9.2,16.6-16.2,34.3-20.8,52.7l-36.8,4.2c-12.8,1.5-22.4,12.3-22.4,25.1v59.7c0,12.8,9.6,23.6,22.4,25.1L61.2,341.538z M277.5,180.038c54.4,0,98.7,44.3,98.7,98.7s-44.3,98.7-98.7,98.7c-54.399,0-98.7-44.3-98.7-98.7S223.1,180.038,277.5,180.038z"></path></svg>
    </span>
  </a></td>`;
  var settingsBtn = settingsTemplate.content.firstChild;

  for (var i = 0; i < pages.length; i++) {
    pages[i].insertBefore(document.importNode(viewBtn, true), pages[i].firstChild);
    pages[i].appendChild(document.importNode(settingsBtn, true));
  }
  document.querySelectorAll('a.customSettingsBtn').forEach(x => x.addEventListener("click", function(e) {
    SettingsOpen();
    e.preventDefault();
  }));

  // Search by Image
  var pages = document.body.querySelectorAll("div.irc_mmc .irc_hd ._r3");
  template.innerHTML = `<span class="_r3">
    <a class="customImageSearch">Seach by Image</a>
  </span>`;

  var searchImg = template.content.firstChild;

  for (var i = 0; i < pages.length; i++) {
    pages[i].appendChild(document.importNode(searchImg, true));
  }
}

function SettingsOpen() {
  // Lazy rendering of settings modal
  if (!settingsRendered) {

    document.body.insertAdjacentHTML('beforeend', `
    <div id="settingsModal" class="modal">
      <div class="modal-content">
        <div id="modalHeader">
          <span class="close">&times;</span>
          <img src="` + chrome.extension.getURL("icons/icon-96.png") + `" />
          <h2>View Image Resurrected</h2>
        </div>
        <div id="modalBody">
        <div>
          <input id="cSettingsNewTab" type="checkbox" checked>Open Images in new tab</input>
          <label for="cSettingsNewTab">Coding</label>
        </div>
        </div>
      </div>
    </div>`);

    var modal = document.getElementById('settingsModal');
    var close = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    close.onclick = function() {
      modal.style.visibility = "hidden";
      modal.style.opacity = 0;
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.visibility = "hidden";
        modal.style.opacity = 0;
      }
    }

    // Add event listeners
    var pages = document.body.querySelectorAll("table._FKw.irc_but_r tbody tr");
    document.querySelectorAll('#modalBody input').forEach(x => x.onchange = settingsChanged);


    settingsRendered = true;
  }
  document.getElementById('settingsModal').style.opacity = 1;
  document.getElementById('settingsModal').style.visibility = "visible";
}







// Settings methods

function settingsChanged(event) {
  alert('change');
}







// Core methods

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