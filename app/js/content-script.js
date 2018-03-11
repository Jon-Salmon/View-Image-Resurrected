var rendered = false;
var lastUrl = "";
var settingsRendered = false;
var abortLink = false;
var defaultSettings = {
  newTab: true,
  openVisible: true,
  primary: "view",
  placement: "default",
  copySupported: false,
  settingPlacement: "seperate"
}

// Renderers

function renderUI() {
  rendered = true;

  chrome.storage.local.get(null, function(settings) {
    settings = Object.assign(defaultSettings, settings);


    var template = document.createElement('template');
    var settingsTemplate = document.createElement('template');


    // View image button
    var view = `<a class="virLink" ` + (settings.newTab ? 'target="_blank"' : '') + `>
        <span> ` + chrome.i18n.getMessage("viewImage") + `</span>
      </a>`;
    var copy = settings.copySupported ? `<a class="virCopyImage" ><span>` + chrome.i18n.getMessage("copyImage") + `</span></a>` : '';
    var save = `<a class="virSaveImage" ><span>` + chrome.i18n.getMessage("downloadImage") + `</span></a>`;

    var settingElement = `<a class="virSettingsBtn">
      <span class="_RKw _wtf _Rtf">
        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;align-content: center;" viewBox="-20 0 580 500"><path d="M61.2,341.538c4.9,16.8,11.7,33,20.3,48.2l-24.5,30.9c-8,10.1-7.1,24.5,1.9,33.6l42.2,42.2c9.1,9.1,23.5,9.899,33.6,1.899 l30.7-24.3c15.8,9.101,32.6,16.2,50.1,21.2l4.6,39.5c1.5,12.8,12.3,22.4,25.1,22.4h59.7c12.8,0,23.6-9.601,25.1-22.4l4.4-38.1 c18.8-4.9,36.8-12.2,53.7-21.7l29.7,23.5c10.1,8,24.5,7.1,33.6-1.9l42.2-42.2c9.1-9.1,9.9-23.5,1.9-33.6l-23.1-29.3 c9.6-16.601,17.1-34.3,22.1-52.8l35.6-4.1c12.801-1.5,22.4-12.3,22.4-25.1v-59.7c0-12.8-9.6-23.6-22.4-25.1l-35.1-4.1 c-4.801-18.3-12-35.8-21.199-52.2l21.6-27.3c8-10.1,7.1-24.5-1.9-33.6l-42.1-42.1c-9.1-9.1-23.5-9.9-33.6-1.9l-26.5,21 c-17.2-10.1-35.601-17.8-54.9-23l-4-34.3c-1.5-12.8-12.3-22.4-25.1-22.4h-59.7c-12.8,0-23.6,9.6-25.1,22.4l-4,34.3 c-19.8,5.3-38.7,13.3-56.3,23.8l-27.5-21.8c-10.1-8-24.5-7.1-33.6,1.9l-42.2,42.2c-9.1,9.1-9.9,23.5-1.9,33.6l23,29.1 c-9.2,16.6-16.2,34.3-20.8,52.7l-36.8,4.2c-12.8,1.5-22.4,12.3-22.4,25.1v59.7c0,12.8,9.6,23.6,22.4,25.1L61.2,341.538z M277.5,180.038c54.4,0,98.7,44.3,98.7,98.7s-44.3,98.7-98.7,98.7c-54.399,0-98.7-44.3-98.7-98.7S223.1,180.038,277.5,180.038z"></path></svg>
      </span>
      ` + (settings.settingPlacement == "menu" ? '<span class="_WKw">' + chrome.i18n.getMessage("settings") + '</span>' : '') + `
    </a>`

    var primary = '';
    var sec1 = '';
    var sec2 = '';

    switch (settings.primary) {
      case "view":
      default:
        primary = view;
        sec1 = copy;
        sec2 = save;
        break;
      case "copy":
        primary = copy;
        sec1 = view;
        sec2 = save;
        break;
      case "save":
        primary = save;
        sec1 = view;
        sec2 = copy;
        break;
    }

    var pages = document.body.querySelectorAll("table.irc_but_r tbody tr");
    template.innerHTML = `<td class="customOpenImage">
    <div class="customTopElement">
    ` + primary + `
      <a class="virDropDown virDropdownClick">
        <span class="_RKw _wtf _Rtf virDropdownClick">
          <svg class="virDropdownClick" xmlns="http://www.w3.org/2000/svg" width="14" height="14" style="vertical-align: middle;align-content: center;" viewBox="0 0 18 18">
            <path class="virDropdownClick" d="M5 8l4 4 4-4z"/>
          </svg>
        </span>
      </a>
    </div>
    <div id="myDropdown" class="dropdown-content">
    ` + sec1 + sec2 + (settings.settingPlacement == "menu" ? settingElement : '') + `
    </div>
    </td>`;

    var viewBtn = template.content.firstChild;







    // Settings btn
    settingsTemplate.innerHTML = `<td class="customSettingsBtn">` + settingElement + `</td>`;
    var settingsBtn = settingsTemplate.content.firstChild;


    for (var i = 0; i < pages.length; i++) {
      if (settings.settingPlacement != "menu") {
        pages[i].appendChild(document.importNode(settingsBtn, true));
      }
      if (settings.placement == "default") {
        pages[i].insertBefore(document.importNode(viewBtn, true), pages[i].firstChild);
      } else {
        pages[i].insertBefore(document.importNode(viewBtn, true), pages[i].childNodes[1]);
      }
    }


    // Dropdown
    document.querySelectorAll('.virDropdownClick').forEach(x => x.addEventListener("click", function(e) {
      e.preventDefault();
      document.querySelectorAll('#myDropdown').forEach(x => x.classList.toggle("show"));

      // Close the dropdown menu if the user clicks outside of it
      window.addEventListener('click', clearDropDown); // add the listener
    }));


    // Copy Image
    document.querySelectorAll('.virCopyImage').forEach(x => x.addEventListener("click", function(e) {

      // // Find element
      // var root = e.target.closest('div.irc_c');
      // var img = root.querySelector('img.irc_mi');
      // var range = document.createRange();
      // range.selectNode(img);
      // window.getSelection().addRange(range);
      // try {
      //   // Now that we've selected the anchor text, execute the copy command
      //   document.execCommand('copy');
      // } catch (err) {
      //   console.log('Oops, unable to copy');
      // }
      //
      // window.getSelection().removeRange(range);
      chrome.runtime.sendMessage({
        request: "copy",
        url: lastUrl
      });
    }));

    // Save Image
    document.querySelectorAll('.virSaveImage').forEach(x => x.addEventListener("click", function(e) {
      chrome.runtime.sendMessage({
        request: "download",
        url: lastUrl
      });
    }));

    // Open settings
    document.querySelectorAll('.virSettingsBtn').forEach(x => x.addEventListener("click", function(e) {
      SettingsOpen();
      e.preventDefault();
    }));



    // Search by Image
    var pages = document.body.querySelectorAll("div.irc_mmc .irc_hd ._r3");
    template.innerHTML = `<span class="_r3 virAllSizes">
      <a class="_ZR" href="#">` + chrome.i18n.getMessage("allSizes") + `</a>
    </span>
    <span class="_r3 customImageSearch">
      <a class="_ZR">` + chrome.i18n.getMessage("searchByImage") + `</a>
    </span>`;

    var searchImg = template.content.childNodes;

    for (var j = 0; j < searchImg.length; j++) {
      for (var i = 0; i < pages.length; i++) {
        pages[i].appendChild(document.importNode(searchImg[j], true));
      }
    }

    document.querySelectorAll('.virAllSizes a').forEach(x => x.addEventListener("click", function(e) {
      e.preventDefault();
      if (e.ctrlKey ||
        e.shiftKey ||
        e.metaKey || // apple
        (e.button && e.button == 1)) {
        openAllSizes(true);
      } else {
        openAllSizes(false);
      }
    }));

    updateLinks(lastUrl);
  });
}

function SettingsOpen() {
  // Lazy rendering of settings modal
  if (!settingsRendered) {

    chrome.storage.local.get(null, function(settings) {
      settings = Object.assign(defaultSettings, settings);

      settingsRendered = true;


      document.body.insertAdjacentHTML('beforeend', `
      <div id="settingsModal" class="modal">
        <div class="modal-content">
          <div id="modalHeader">
            <span class="close">&times;</span>
            <img src="` + chrome.extension.getURL("icons/icon-96.png") + `" />
            <h2>` + chrome.i18n.getMessage("extensionName") + `</h2>
          </div>
          <div id="modalBody">
            <div>
              <div class="settingItem">
                <h3>` + chrome.i18n.getMessage("settingsPrimary") + `</h3>
                <input type="radio" id="virPrimaryView" name="primary" value="view" ` + (settings.primary == "view" ? "checked" : "") + `>
                <label for="virPrimaryView">` + chrome.i18n.getMessage("viewImageSetting") + `</label><br>

                ` + (settings.copySupported ? `<input type="radio" id="virPrimaryCopy" name="primary" value="copy" ` + (settings.primary == "copy" ? "checked" : "") + `>
                <label for="virPrimaryCopy">` + chrome.i18n.getMessage("copyImageSetting") + `</label><br>` : '') + `

                <input type="radio" id="virPrimarySave" name="primary" value="save" ` + (settings.primary == "save" ? "checked" : "") + `>
                <label for="virPrimarySave">` + chrome.i18n.getMessage("copyImageSetting") + `</label>
              </div>

              <div class="settingItem">
                <h3>` + chrome.i18n.getMessage("btnPlacement") + `</h3>
                <input type="radio" id="virPlacementDefault" name="placement" value="default" ` + (settings.placement == "default" ? "checked" : "") + `>
                <label for="virPlacementDefault">` + chrome.i18n.getMessage("btnPlaceDefault") + `</label><br>

                <input type="radio" id="virPlacementTraditional" name="placement" value="traditional" ` + (settings.placement == "traditional" ? "checked" : "") + `>
                <label for="virPlacementTraditional">` + chrome.i18n.getMessage("btnPlaceOrigional") + `</label>
              </div>

              <div class="settingItem">
                <h3>` + chrome.i18n.getMessage("settingBtnPlacement") + `</h3>
                <input type="radio" id="virSetPlacementSep" name="settingPlacement" value="seperate" ` + (settings.settingPlacement == "seperate" ? "checked" : "") + `>
                <label for="virSetPlacementSep">` + chrome.i18n.getMessage("settingBtnSeperate") + `</label><br>

                <input type="radio" id="virSetPlacementMenu" name="settingPlacement" value="menu" ` + (settings.settingPlacement == "menu" ? "checked" : "") + `>
                <label for="virSetPlacementMenu">` + chrome.i18n.getMessage("settingBtnDropdown") + `</label>
              </div>

              <div class="settingItem">
                <h3>` + chrome.i18n.getMessage("settingsAdvHeader") + `</h3>
                <input id="cSettingsNewTab" name="newTab" type="checkbox" ` + (settings.newTab ? 'checked' : '') + `>` + chrome.i18n.getMessage("settingAdvNewTab") + `</input>
              </div>

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


      document.getElementById('settingsModal').style.opacity = 1;
      document.getElementById('settingsModal').style.visibility = "visible";
    });
  } else {
    document.getElementById('settingsModal').style.opacity = 1;
    document.getElementById('settingsModal').style.visibility = "visible";
  }
}





// Dropdown methods
function clearDropDown(event) {
  if (!event.target.matches('.virDropdownClick')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    window.removeEventListener('click', clearDropDown); // add the listener
  }
}


// Settings methods

function settingsChanged(event) {
  if (event.target.type == "checkbox") {
    var name = event.target.name;
    chrome.storage.local.set({
      [name]: event.target.checked
    }, function() {
      refreshUI();
    });
  } else if (event.target.type == "radio") {
    var name = event.target.name;
    chrome.storage.local.set({
      [name]: event.target.value
    }, function() {
      refreshUI();
    });
  }
}

function refreshUI() {
  document.querySelectorAll('.customOpenImage').forEach(x => x.parentNode.removeChild(x));
  document.querySelectorAll('.customSettingsBtn').forEach(x => x.parentNode.removeChild(x));
  document.querySelectorAll('.customImageSearch').forEach(x => x.parentNode.removeChild(x));
  document.querySelectorAll('.virAllSizes').forEach(x => x.parentNode.removeChild(x));
  renderUI();
}

function openAllSizes(newTab) {
  abortLink = false;
  startLoad();
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      // get image id
      let id = xmlHttp.responseText.match(/simg:([^&]+)/)[1];

      // check if aborted
      console.log(abortLink);
      if (abortLink) {
        return;
      }

      // open link
      if (newTab) {
        window.open('/search?tbm=isch&tbs=simg:' + id, '_blank');
      } else {
        window.location.href = '/search?tbm=isch&tbs=simg:' + id;
      }
      endLoad();
    }
  };
  xmlHttp.open("GET", window.location.protocol + "//" + window.location.host + "/searchbyimage?image_url=" + lastUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function startLoad() {
  document.body.insertAdjacentHTML('beforeend', `<div id="loadingOverlay" class="loading"></div>`);

  var modal = document.getElementById('loadingOverlay');

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      abortLink = true;
      endLoad();
    }
  }

  document.getElementById('loadingOverlay').style.opacity = 1;
  document.getElementById('loadingOverlay').style.visibility = "visible";
}

function endLoad() {
  var overlay = document.querySelector('#loadingOverlay');
  overlay.parentNode.removeChild(overlay);
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
  lastUrl = url;
  updateLinks(url);
});

function updateLinks(url) {
  document.querySelectorAll('.customOpenImage a.virLink').forEach(x => x.setAttribute("href", url));
  document.querySelectorAll('.customImageSearch a').forEach(x => x.setAttribute("href", "/searchbyimage?image_url=" + url));
}


// Create an observer instance linked to the callback function
var observer = new MutationObserver(domChanged);

// Start observing the target node for configured mutations
observer.observe(document.body, {
  attributes: true,
  childList: true
});