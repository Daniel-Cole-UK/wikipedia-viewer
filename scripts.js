function compare(a, b) {
  if (a.index < b.index)
    return -1;
  else if (a.index > b.index)
    return 1;
  else
    return 0;
}

function makeList(index, title, description, pageId) {
  var item = '<div class="resultItem" id="item' + index + '"><a class="resultLink" target="_blank" href="https://en.wikipedia.org/?curid=' + pageId + '"><div class="resultItemTitle"><h3>' + title + '</h3></div><div class="resultItemDescription"><p>' + description + '</p></div></a></div>';
  return item;
}

$('document').ready(function() {
  $('#footer').addClass('showFooter');
  $('#mainTitle').fadeIn(2000);
  $('#footerSearchButton').click(function(){
    $('#results').hide();
    $('#mainTitle').hide();
    $('#searchContainer').show();
    $('#footer').addClass('hideFooter');
    $('#searchBox').focus();
  });
  $('#searchCancel').click(function(){
    $('#searchContainer').hide();
    if (!$('#results').html()) {
      $('#mainTitle').fadeIn(1000);
    }
    $('#footer').removeClass('hideFooter');
    $('#results').show();
  });
  $('form').submit(function() {
    if ($('#searchBox').val() !== "") {
      var searchString = $('#searchBox').val();
      $('#results').empty();
      $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&indexpageids=1&generator=search&exchars=150&exlimit=20&exintro=1&explaintext=1&gsrsearch=' + searchString + '&gsrlimit=20',
        dataType: "jsonp",
        success: function(data) {
          $('#searchContainer').hide();
          $('#footer').removeClass('hideFooter');
          var ids = data.query.pageids;
          var results = [];
          var pages = data.query.pages;

          ids.forEach(function(ids) {
            results.push(pages[ids]);
          });
          
          results.sort(compare);
          
          $('#results').hide();
          for (i = 0; i < results.length; i++) {
            $('#results').append(makeList(results[i].index, results[i].title, results[i].extract, results[i].pageid));
          };
          $('#results').slideDown( 1000 );
        },
        error: function() {
          $('#results').empty();
          return false;
        }
      });
    return false;
    } else {
      $('#results').empty();
      return false;
    }
  });
});