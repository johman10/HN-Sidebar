$(document).ready(function() {
  var itemUrl = window.location.href;
  var ajaxUrl = 'https://hn.algolia.com/api/v1/search?query=' + itemUrl + '&restrictSearchableAttributes=url&tags=front_page';

  $.ajax({
    url: ajaxUrl
  })
  .done(function(data) {
    if (data.hits.length > 0) {
      getComments(data.hits[0].objectID);
    }
  });
});

$('html').on('click', '.hn-comments-sidebar .hn-toggle', function(event) {
  $('.hn-comments-sidebar').toggleClass('sidebar-hidden');
});

function getComments(objectID) {
  var commentsUrl = 'https://hn.algolia.com/api/v1/items/' + objectID;

  $.ajax({
    url: commentsUrl
  })
  .done(function(data) {
    if (data.children.length > 0) {
      initSidebar(data);
    }
  });
}

function initSidebar(data) {
  $('html').append('<div class="hn-comments-sidebar sidebar-hidden">' +
    '<div class="hn-toggle"></div>' +
    '<div class="hn-comments">' +
      listChildren(data.children, 0) +
    '</div>' +
  '</div>');
}

function listChildren(children, depth) {
  var comments = '';

  if (children.length > 0 && Array.isArray(val.children)) {
    $.each(children, function(index, val) {
      if (val.points === null) {
        val.points = '0';
      }

      comments += '<div class="hn-comment depth-' + depth + '">' +
                    '<div class="user">' +
                      val.author +
                    '</div>' +
                    '<div class="points">' +
                      val.points +
                    '</div>' +
                    '<div class="text">' +
                      val.text +
                    '</div>' +
                    listChildren(val.children, depth + 1) +
                  '</div>';
    });
  }

  return comments;
}
