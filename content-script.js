var added = false;

$(document).ready(function() {

  // Addes button to relevant places
  $(".rg_l").on("click", function() {
    // alert("Handler for .click() called.");
    if (!added) {
      $("table._FKw.irc_but_r tbody tr").prepend('<td><a target="_blank" class="customOpenImage">View Image</a></td>');
      $('<span class="_r3"><a class="customImageSearch _ZR irc_hol" rel="noopener" href="_" target="_blank">Seach by Image</span></a></span>')
        .insertAfter("div.irc_mmc .irc_hd ._r3")
      added = true;
    }
  });

  // Updates button href when event detected by background script
  chrome.runtime.onMessage.addListener(function(url) {
    $("a.customOpenImage").attr("href", url);
    $("a.customImageSearch").attr("href", "/searchbyimage?image_url=" + url);
  });

});