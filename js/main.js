var GoogleMapApi = (function(options){

  var myLatLng = {lat: 33.742712, lng: -84.338520}; // initial center point of map

    

  function initMap() {
    var infowindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 2
    });
    
    var marker = new google.maps.Marker({
      position:myLatLng,
      map: map,
      title: 'My House',
      animation: google.maps.Animation.DROP
    });
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('My House');
        infowindow.open(map, this);
    });
  };
  
  function createMarker(result) {
    var marker = new google.maps.Marker({
      position:result.geometry.location,
      map: map,
      title: result.name,
      animation: google.maps.Animation.DROP
    });
    
    google.maps.event.addListener(marker, 'click', function() {
        createInfoWindow(result,marker);
        infowindow.open(map, this);
    });
  };

  function createInfoWindow(result, marker) {
    var contentString = `<h3 class="marker-title">${result.name}<h3><div class="marker-address">${result.formatted_address}</div>`
    infowindow.setContent(contentString);
  };


  function processPlacesResults(results, status) {
    setSearchResult(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        createMarker(result);
      }
    }
  };


  function search() {
    var searchItem = document.getElementById("searchField").value;
    var request = {
      location: myLatLng,
      radius: '5',
      query: searchItem,
      openNow:true
    };

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, processPlacesResults);
  }

  return {
    init: initMap
  };

}());


var TwitterApi = (function(options) {

	//-------GLOBAL VARS----------//
	var shared = {};
	var options = options || {};

	
	//-------CLICK HANDLERS-------------------//
	function setupListeners() {
		setupSearch();
	}

	//-------------------Display Tweets---------------//

	function displayTweets(tweets, $results, keyword) {

		$results.empty();
		// console.log(tweets);
		for (var i = 0; i < tweets.length; i++) {
		    var r = tweets[i];
		    var status = r.text;


		    // check for Twitter Handles
		    var processedTweet = RegExModule.highlightTweet(status, keyword);
		    console.log(processedTweet);



		    var $li = document.createElement('li');
		    $li.innerHTML = processedTweet;
		    $results.append($li);
		}

	}

	//--------------------Search setup()---------//
	function setupSearch() {

	    $('form[name=search] button').click(function(event) {
	        var $e = $(event.currentTarget),
	            $form = $e.closest('form'),
	            params = {},
	            $results = $form.find('.results ul'),
	            keyword = $form.find('input[name=q]').val();

	        params['op'] = 'search_tweets'; 
	        params['q'] = keyword; 
	        var $count_f = $form.find('input[name=count]');
	        if ($count_f) {
	            params['count'] = $count_f.val(); 
	        }
	        var $result_type_f = $form.find('select[name=result_type]');
	        if ($result_type_f) {
	            params['result_type'] = $result_type_f.val(); 
	        }

	        $.ajax({
	            dataType: "json",
	            url: 'twitter-proxy.php',
	            data: params
	        }).done(function(response) {
	            displayTweets(response.statuses, $results, keyword);
	        });

	        return false;
	    });
	}

	//------------init-------------//

	var init = function() {
		setupListeners();
	};
	shared.init = init;

	return shared;
}());
TwitterApi.init();


//----------------------RegEx--------------------------//

var RegExModule = (function(options) {


	function highlightTwitterHandle(tweet) {

		var handleRE = /@(\w{1,15})\b/g;
		var newString = tweet.replace(handleRE,'<a class="highlight target="_blank" href="http://www.twitter.com/$1">@$1</a>' );

		return newString;
	}

	function highlightKeyword(string, keyword) {
		var keywordRE = new RegExp("("+keyword+")", "gi");
		var newString = string.replace(keywordRE,'<span class="highlight">$1</span>');

		return newString;
	}

	function highlightURL(string) {
		
		var urlRE = /(\w+:\/\/[^\s]+\.[^\s]{2,})/gi;
		var newString = string.replace(urlRE,'<a class="highlight target="_blank" href="$1">$1</a>');


		return newString;
	}

	function highlightTweet(tweet, keyword) {
		
	 	var processed = highlightURL(tweet)	
		processed = highlightTwitterHandle(processed)		
		processed = highlightKeyword(processed, keyword)		

		return processed;
	}

	return {
		highlightTweet: highlightTweet,
		highlightTwitterHandle: highlightTwitterHandle,
		highlightURL: highlightURL
	}

})();






