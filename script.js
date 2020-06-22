$(document).ready(function() {
    var date = moment().format('L');

    
    $("#search-city-button").on("click", function(event) {
        event.preventDefault();
        var city = $("#city-input").val().trim();        
        cityHistory.push(city);
        storeButtons()
        displayCurrentInfo(city);
        displayFutureInfo(city);
        renderButtons(city);
        var cityName = $("#city-input").val();
        storeInput(cityName);
        $("#city-input").val("");
    });
  
    //render city history buttons when the search button was clicked
    function renderButtons(city){
        var createButtons = $("<button>");
        //add class to each buttons
        createButtons.addClass("cityButtons btn btn-block");
        createButtons.attr("data-name", city);
        createButtons.text(city);
        //prepend the city name into the div
        $("#search-history").prepend(createButtons);
       
    }
    
    //display the selected city's current weather info
    function displayCurrentInfo(cityName){
        var api = "799b2e28ba937cc7758d7fb44bbba546";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&appid=" + api;
      
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            console.log(response)
            var iconCode = response.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var addIcon = $("<img>").attr("src", iconurl);
            console.log(response.main.temp)
            var tempC = ((response.main.temp - 273.15)).toFixed(1);
 
            $(".city").text(response.name +"  ("+date +")")
            $(".city").append(addIcon); 
            $(".temperature").text("Temperature:  " + tempC + " °C"); 
            $(".humidity").text("Humidity:  "+ response.main.humidity + "%");
            $(".wind-speed").text("Wind speed:  "+ (response.wind.speed * 0.62).toFixed(0) + " km/h");      

            var lat = response.coord.lat;
            var lon = response.coord.lon;

            var uvIndex = function(lat, lon){
                var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+ api +"&lat="+ lat +"&lon="+ lon;
                $.ajax({
                    url: UVqueryURL,
                    method: "GET"
                    }).then(function(response) {
                        console.log(response)
                        var uvValue = response.value;
                        var uvSafety = $("<span>").attr("id", "uvSafety").addClass("badge");
                        uvSafety.text(uvValue);
                         if (uvValue <= 2){
                            uvSafety.addClass("favorable");
                        }else if (uvValue >=3 && uvValue <=7){
                            uvSafety.addClass("moderate");
                        }else{
                            uvSafety.addClass("severe");
                        }
                         $(".uv-index").text("UV Index:  " );
                        $(".uv-index").append(uvSafety);
                     })
            }
            uvIndex(lat,lon);
          
        })
    }

    function displayFutureInfo(cityName){
        var api = "799b2e28ba937cc7758d7fb44bbba546";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ cityName +"&appid=" + api;
      
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            $("#forecast").empty();
            console.log(response);
            var index = [4,12,20,28,36];
            for(var i = 0; i < index.length; i++){
                var createDiv = $("<div class = 'card'>");
                var lineBreak = $("<br>");
  
                var futureTime = moment().add(i+1, 'd').format('L');
                var pTime = $("<h5>").text(futureTime);
                createDiv.append(pTime, lineBreak);
 
                var iconCode = response.list[index[i]].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                var addIcon = $("<img>").attr("src", iconurl);
                addIcon.css("width", "50px");
                createDiv.append(addIcon, lineBreak);
  
                var temp = ((response.list[index[i]].main.temp - 273.15)).toFixed(1);
                var pTemp = $("<p>").text("Temp: " + temp + " °C");
                createDiv.append(pTemp, lineBreak);
 
                var humidity = response.list[index[i]].main.humidity;
                var pHumid = $("<p>").text("Humidity: " + humidity);
                createDiv.append(pHumid);
               
                $("#forecast").append(createDiv);
            }
           
          
        })
    }

    $(document).on("click", ".cityButtons", function(event) {
        event.preventDefault();
        var cityName = $(this).attr("data-name");
        cityHistory.push(cityName);
        displayCurrentInfo(cityName);
        displayFutureInfo(cityName);
    })

    function storeInput(cityName){
        localStorage.setItem("Last city searched", cityName);
    }
    displayCurrentInfo(localStorage.getItem("Last city searched"));
    displayFutureInfo(localStorage.getItem("Last city searched"));
  
    var cityHistory = JSON.parse(window.localStorage.getItem("history")) || [];

    if(cityHistory.length > 0){
        displayCurrentInfo(cityHistory[cityHistory.length - 1])
    }

    for(var i = 0; i < cityHistory.length; i++){
        renderButtons(cityHistory[i]);
    }

    function storeButtons(){
        localStorage.setItem("history", JSON.stringify(cityHistory));
    }

 })