$(document).ready(function() {
  // We need to find out if the current URL is a story on HN
  // It's important these calls are HTTPS to make sure it works on every page
  // Safari stops you from calling a HTTP request on a HTTPS page, and HTTPS is better so yeah....
  var itemUrl = window.location.host;
  var ajaxUrl = 'https://hn.algolia.com/api/v1/search?query=' + itemUrl + '&restrictSearchableAttributes=url&tags=front_page';

  $.ajax({
    url: ajaxUrl
  })
  .done(function(data) {
    // If the story is found with the current URL run another function
    if (data.hits.length > 0) {
      getComments(data.hits[0].objectID);
    }
  });
});

$('html').on('click', '.hn-comments-sidebar .hn-toggle', function(event) {
  $('.hn-comments-sidebar').toggleClass('sidebar-hidden');
});

function getComments(objectID) {
  // The first API call didn't return comments so we need to do anthother call to get those
  var commentsUrl = 'https://hn.algolia.com/api/v1/items/' + objectID;

  $.ajax({
    url: commentsUrl
  })
  .done(function(data) {
    // If there are any comments trigger the sidebar initializer
    if (data.children.length > 0) {
      initSidebar(data);
    }
  });
}

function initSidebar(data) {
  // Append sidebar to the current page html tag
  $('html').append('<div class="hn-comments-sidebar sidebar-hidden">' +
    '<div class="hn-toggle"></div>' +
    '<div class="hn-comments">' +
      listChildren(data.children, 0) +
    '</div>' +
  '</div>');
}

function listChildren(children, depth) {
  var comments = '';

  // The API returns an hash with a key children
  // Let's check if there are children and that children is an array
  // JS seems to be doing somethings strange here with listing all the keys when calling children
  if (children.length > 0 && Array.isArray(val.children)) {
    $.each(children, function(index, val) {
      // API return null if no points, let's fix that to make sure we have a nice show
      if (val.points === null) {
        val.points = '0';
      }

      // HTML of each comment
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
                    // Since we have dept in the comments we need to run this function again with a new depth
                    listChildren(val.children, depth + 1) +
                  '</div>';
    });
  }

  // Return the comments HTML to the place this function is called from
  return comments;
}
