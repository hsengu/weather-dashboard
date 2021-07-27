var weatherAPIkey = "appid=0bd42ea98f8e5a4a1fd57cbc6cf3c785";
var endpoint = "https://api.openweathermap.org/data/2.5/";
var weather = "weather?q=";
var onecall = "onecall?";
var exclude = "exclude=minutely,hourly";
var cityName = "";
var recent = [];

// API call function
function lookupWeather(query) {
    fetch(endpoint + weather + query + "&" + weatherAPIkey).then(function(weatherResponse) {
        if(weatherResponse.ok) {
            return weatherResponse.json();
        } else {
            alert("Status: " + weatherResponse.status + " - " + weatherResponse.statusText);
        }
    }).then(function(weatherData) {
        var lat = "lat=" + weatherData.coord.lat;
        var lon = "lon=" + weatherData.coord.lon;
        cityName = weatherData.name;
        fetch(endpoint + onecall + lat + "&" + lon + "&" + exclude + "&" + weatherAPIkey).then(function(onecallResponse) {
            if(onecallResponse.ok) {
                return onecallResponse.json();
            } else {
                alert("Status: " + onecallResponse.status + " - " + onecallResponse.statusText);
            }
        }).then(function(onecallData) {
            outputWeather(onecallData);
            outputForecast(onecallData);
            updateHistory();
        });
    });
};

// Function for outputting current weather data
function outputWeather(data) {
    var cardEl = $("#main-card");
    cardEl.html("");

    var cardBodyEl = $("<div class='card-body main-card'>");
    var h4El = $("<h4 class='card-title main-card-title'>");

    var date = new Date(data.current.dt * 1000);
    date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    h4El.html("<span>" + cityName + " (" + date + ")</span><span><img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png'></img></span>");
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
                var spanEl = $("<span class='" + bg_color + " uvi'>" + data.current.uvi.toFixed(2) + "</span>");
                spanEl.appendTo(pEl);
                break;
        }

        pEl.appendTo(cardBodyEl);
    }

    cardBodyEl.appendTo(cardEl);
}

// Function for outputting forecast data for next 5 days
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

    for(var i = 1; i <= 5; i++) {                               // Loop 5 times (5-days)
        var colBreakEl = $("<div class='d-xl-none w-100'>")
        colEl = $("<div class='col-sm hidden-xs'>");

        var cardEl = $("<div class='card'>");
        var cardBodyEl = $("<div class='card-body forecast-card'>");
        var h4El = $("<h5 class='card-title forecast-card-title'>");
    
        var date = new Date(data.daily[i].dt * 1000);
        date = "<span>" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        h4El.html("<span>" + date + "</span><br><span><img src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png'></img></span>");
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
        if((i % 2) === 0)                   // Insert a column break before 2nd and 4th columns
            colBreakEl.appendTo(rowEl);
        colEl.appendTo(rowEl);
    }

    rowEl.appendTo(forecastCol);
}

// Function for updating history list
function updateHistory() {
    var historyListEl = $("#history-list");
    var findIndex = recent.findIndex(city => city === cityName);

    if(findIndex > -1)                  // Always keep most recent search at the last element
        recent.splice(findIndex, 1);
    if(cityName !== "")
        recent.push(cityName);


    if(recent.length > 0) {
        historyListEl.html("");

        for(var i = recent.length - 1; i >= 0 ; i--) {              // Create the history list rear to front (most recent at the top)
            var btnEl = $("<button class='btn btn-secondary btn-block'>");
            
            btnEl.text(recent[i]);
            btnEl.appendTo(historyListEl);
        }
    } else
        return;

    localStorage.setItem("history", JSON.stringify(recent));
    cityName = "";

    $("#history-list button").click(function() {
        var search = $(this).text();
        $("#search-box").val("");
        lookupWeather(search);
    });
}

// Function for loading history from local storage
function getRecent() {
    recent = localStorage.getItem("history");

    recent = recent ? JSON.parse(recent) : [];

    updateHistory();
}

// Convert default temp units from kelvin to Fahrenheit
function convertToImperial(kelvin) {
    return (((kelvin - 273.15) * 1.8) + 32);
}

// Convert default temp units from kelvin to Celcius
function convertToMetric(kelvin) {
    return (kelvin - 273.15);
}

// Convert default m/s to mph
function convertToMPH(meters) {
    return meters * 2.237;
}

// Search button click handler
$("#search-btn").click(function() {
    var search = $("#search-box").val();
    console.log(search);
    if(search === "")
        alert("Please enter a city name.");
    else {
        $("#search-box").val("");
        lookupWeather(search);
    }
});

// Search box handler
$("#search-box").keypress(function(event) {
    if(event.keyCode == "13") {
        $("#search-btn").trigger("click");
        $(this).val("");
        $(this).blur();
    }
});

// Load history when document is ready
$(document).ready(getRecent());