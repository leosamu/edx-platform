function sendLog(type, data) {
  var message = data || {};
  message.chapter = document.title;
  Logger.log("book." + type, message);
};

var first_page = true;

$(window).bind("pagechange", function(event) {
  // log every page render
  var page = event.originalEvent.pageNumber;
  // pagechange is called many times per viewing.
  if (PDFView.previousPageNumber !== page || first_page) {
    first_page = false;
    sendLog("page.display", {"current": page});
    // compatibility with old events
    Logger.log("book", {"type": "gotopage", "old": PDFView.previousPageNumber, "new": page});
  }
});

// this is called too often
// $(window).bind('pagerender', function(event) {
//   var message = {
//       "current": event.originalEvent.detail.pageNumber
//     };
//   sendLog("page.display", message);
// });

$('#viewThumbnail,#sidebarToggle').on('click', function() {
    sendLog("action.togglethumbs", {"page": PDFView.page});
  });

// this doesn't work yet because the event isn't created properly
// $('#thumbnailView a').on('click', function(){
//   sendLog("action.thumb.click", {"title": $(this).attr("title")});
// });

$('#viewOutline').on('click', function() {
    sendLog("action.outline", {"page": PDFView.page});
  });

$('#previous').on('click', function() {
    sendLog("action.prev", {"page": PDFView.page - 1});
    // compatibility
    Logger.log("book", {"type": "prevpage", "new": PDFView.page - 1});
  });

$('#next').on('click', function() {
    sendLog("action.next", {"page": PDFView.page + 1});
    // compatibility
    Logger.log("book", {"type": "nextpage", "new": PDFView.page + 1});
  });

$('#zoomIn,#zoomOut').on('click', function() {
    sendLog("action.zoom.button", {"direction": $(this).attr("id")});
  });

$('#pageNumber').on('change', function() {
    sendLog("action.pagenum", {"page": $(this).val()});
  });

var old_amount = 1;
$(window).bind('scalechange', function(evt) {
  var amount = evt.originalEvent.scale;
  if (amount !== old_amount) {
    sendLog("view.zoom", {"amount": amount});
    old_amount = amount;
  }
});

$('#scaleSelect').on('change', function() {
  sendLog("action.zoom.menu", {"amount": $("#scaleSelect").val()});
});

$(window).bind("find findhighlightallchange findagain findcasesensitivitychange", function(event) {
  var message = event.originalEvent.detail;
  sendLog("action." + event.type, message);
});
