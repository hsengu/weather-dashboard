var weatherAPIkey = "&appid=0bd42ea98f8e5a4a1fd57cbc6cf3c785";
var endpoint = "https://api.openweathermap.org/data/2.5/";
var weather = "weather?q=";
var forecast = "forecast?q=";

function lookupWeather(query) {
    fetch(endpoint + weather + query + weatherAPIkey).then(function(weatherResponse) {
        if(weatherResponse.ok) {
            return weatherResponse.json();
        } else {
            alert(weatherResponse.status);
        }
    }).then(function(weatherData) {
        outputWeather(weatherData);
        fetch(endpoint + forecast + query + weatherAPIkey).then(function(forecastResponse) {
            if(forecastResponse.ok) {
                return forecastResponse.json();
            } else {
                alert(forecastResponse.status);
            }
        }).then(function(forecastData) {
            console.log(forecastData);
        });
    });
};

function outputWeather(data) {
    var cardEl = $("#main-card");
    cardEl.html("");

    var cardBodyEl = $("<div class='card-body'>");
    var h5El = $("<div class='card-title'>");
    var h6El = $("<div class='card-subtitle mb-2 text-muted'>");
    

    var date = new Date(data.dt * 1000);
    date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    h5El.text(data.name + " (" + date + ")");
    h5El.appendTo(cardBodyEl);
    
    for(var i = 0; i < 4; i++) {
        var pEl = $("<p>");
        var lineText = "";

        switch(i) {
            case 0: lineText += "Temp: " + convertToImperial(data.main.temp);
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }

        pEl.appendTo(cardBodyEl);
    }

    cardBodyEl.appendTo(cardEl);
}

function outputForecast(forecastData) {

}

function convertToImperial(kelvin) {
    return (((kelvin - 273.15) * 1.8) + 32);
}

function convertToMetric(kelvin) {
    return (kelvin - 273.15);
}

$("#search-btn").click(function() {
    var search = ($(this).parent().siblings()[0].value);
    lookupWeather(search);
});

