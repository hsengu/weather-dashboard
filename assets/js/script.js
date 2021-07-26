var weatherAPIkey = "appid=0bd42ea98f8e5a4a1fd57cbc6cf3c785";
var endpoint = "https://api.openweathermap.org/data/2.5/";
var weather = "weather?q=";
var onecall = "onecall?";
var exclude = "exclude=minutely,hourly";
var cityName = "";

function lookupWeather(query) {
    fetch(endpoint + weather + query + "&" + weatherAPIkey).then(function(weatherResponse) {
        if(weatherResponse.ok) {
            return weatherResponse.json();
        } else {
            alert(weatherResponse.status);
        }
    }).then(function(weatherData) {
        var lat = "lat=" + weatherData.coord.lat;
        var lon = "lon=" + weatherData.coord.lon;
        cityName = weatherData.name;
        fetch(endpoint + onecall + lat + "&" + lon + "&" + exclude + "&" + weatherAPIkey).then(function(onecallResponse) {
            if(onecallResponse.ok) {
                return onecallResponse.json();
            } else {
                alert(onecallResponse.status);
            }
        }).then(function(onecallData) {
            console.log(onecallData);
            outputWeather(onecallData);
        });
    });
};

function outputWeather(data) {
    var cardEl = $("#main-card");
    cardEl.html("");

    var cardBodyEl = $("<div class='card-body'>");
    var h5El = $("<div class='card-title'>");
    var h6El = $("<div class='card-subtitle mb-2 text-muted'>");
    

    var date = new Date(data.current.dt * 1000);
    date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    h5El.text(cityName + " (" + date + ")");
    h5El.appendTo(cardBodyEl);
    
    for(var i = 0; i < 4; i++) {
        var pEl = $("<p>");

        switch(i) {
            case 0: pEl.text("Temp: " + convertToImperial(data.current.temp) + " \xB0F");
                break;
            case 1: pEl.text("Wind: " + convertToMPH(data.current.wind_speed) + "MPH");
                break;
            case 2: pEl.text("Humidity: " + data.current.humidity + "%");
                break;
            case 3: pEl.text("UV Index: " + data.current.uvi);
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

function convertToMPH(meters) {
    return meters * 2.237;
}

$("#search-btn").click(function() {
    var search = ($(this).parent().siblings()[0].value);
    lookupWeather(search);
});

