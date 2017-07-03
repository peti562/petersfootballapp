var fetchNews = function () {
 

	$('#newsColumn').empty();
  $.ajax({
    url: 'https://newsapi.org/v1/articles?source=four-four-two&sortBy=top&apiKey=9a8e2533e95a4c23a5bf8dd92b52edfa',
    dataType: 'json',
    type: 'GET',
    success: function(data) {


   console.log(data);
     var articles = data.articles;
     for (var i = 0; i < articles.length; i++) {
     	var source = $('#news-template').html();
  		var template = Handlebars.compile(source);
  		var newHTML = template(articles[i]);
 		$('#newsColumn').append(newHTML);
     }
    }
  });


}

fetchNews();