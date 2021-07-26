var weatherAPIkey = "&appid=0bd42ea98f8e5a4a1fd57cbc6cf3c785";
var endpoint = "https://api.openweathermap.org/data/2.5/";
var weather = "weather?q=";
var forecast = "forecast?q=";

function lookupWeather(query) {
    fetch(endpoint + weather + query + weatherAPIkey).then(function(weatherResponse) {
        if(weatherResponse.ok) {
            return weatherResponse.json;
        } else {
            alert(weatherResponse.status);
        }
    }).then(function(weatherData) {
        console.log(weatherData);
        fetch(endpoint + forecast + query + weatherAPIkey).then(function(forecastResponse) {
            if(forecastResponse.ok) {
                return(forecastResponse.json);
            } else {
                alert(forecastResponse.status);
            }
        }).then(function(forecastData) {
            console.log(forecastData);
        });
    });
};

$("#search-btn").click(function() {
    var search = ($(this).parent().siblings()[0].value);
    lookupWeather(search);
});

