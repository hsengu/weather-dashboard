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
            outputWeather(onecallData);
            outputForecast(onecallData);
        });
    });
};

function outputWeather(data) {
    var cardEl = $("#main-card");
    cardEl.html("");

    var cardBodyEl = $("<div class='card-body'>");
    var h4El = $("<h4 class='card-title'>");
    

    var date = new Date(data.current.dt * 1000);
    date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    h4El.text(cityName + " (" + date + ")");
    h4El.appendTo(cardBodyEl);
    
    for(var i = 0; i < 4; i++) {
        var pEl = $("<p>");

        switch(i) {
            case 0: pEl.text("Temp: " + convertToImperial(data.current.temp).toFixed(2) + " \xB0F");
                break;
            case 1: pEl.text("Wind: " + convertToMPH(data.current.wind_speed).toFixed(2) + " mph");
                break;
            case 2: pEl.text("Humidity: " + data.current.humidity + "%");
                break;
            case 3: pEl.text("UV Index: ");
                if(data.current.uvi >= 8)
                    bg_color = "bg-danger";
                else if(data.current.uvi >= 3)
                    bg_color = "bg-warning";
                else
                    bg_color = "bg-success";
                var spanEl = $("<span class='" + bg_color + "'>" + data.current.uvi.toFixed(2) + "</span>");
                spanEl.appendTo(pEl);
                break;
        }

        pEl.appendTo(cardBodyEl);
    }

    cardBodyEl.appendTo(cardEl);
}

function outputForecast(data) {
    var forecastCol = $("#forecast");
    forecastCol.html("");

    var rowEl = $("<div class='row'>");
    var colEl = $("<div class='col'>");
    var h5El = $("<h5>");
    h5El.text("5-Day Forecast");

    h5El.appendTo(colEl);
    colEl.appendTo(rowEl);
    rowEl.appendTo(forecastCol);
    
    rowEl = $("<div class='row'>");

    for(var i = 1; i <= 5; i++) {
        colEl = $("<div class='col'>");

        var cardEl = $("<div class='card'>");
        var cardBodyEl = $("<div class='card-body'>");
        var h4El = $("<h4 class='card-title'>");
    
        var date = new Date(data.daily[i].dt * 1000);
        date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        h4El.text(date);
        h4El.appendTo(cardBodyEl);
        
        for(var j = 0; j < 3; j++) {
            var pEl = $("<p>");
    
            switch(j) {
                case 0: pEl.text("Temp: " + convertToImperial(data.daily[i].temp.max).toFixed(2) + " \xB0F");
                    break;
                case 1: pEl.text("Wind: " + convertToMPH(data.daily[i].wind_speed).toFixed(2) + " mph");
                    break;
                case 2: pEl.text("Humidity: " + data.daily[i].humidity + "%");
                    break;
            }
    
            pEl.appendTo(cardBodyEl);
        }
    
        cardBodyEl.appendTo(cardEl);
        cardEl.appendTo(colEl);
        colEl.appendTo(rowEl);
    }

    rowEl.appendTo(forecastCol);
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

$("#search-box").keypress(function(event) {
    if(event.keyCode == "13") {
        $("#search-btn").trigger("click");
        $(this).blur();
    }
});
