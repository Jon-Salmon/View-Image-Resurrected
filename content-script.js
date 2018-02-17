var added = false;

$(document).ready(function() {

  // Addes button to relevant places
  $(".rg_l").on("click", function() {
    // alert("Handler for .click() called.");
    if (!added) {
      $("table._FKw.irc_but_r tbody tr").prepend('<td><a target="_blank" class="customOpenImage">View Image</a></td>');
      added = true;
    }
  });

  // Updates button href when event detected by background script
  browser.runtime.onMessage.addListener(function(url) {
    $(".customOpenImage").attr("href", url);
  });

});