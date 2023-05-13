const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

require('dotenv').config();

const app = express();

app.set('view engine', "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
   res.sendFile(__dirname + "/index.html")
   
});

app.post("/weather", function(req, res) {
    //building the API url
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const units = "metric";
    const url = https.get("https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units)


    https.get(url, function(response) {
    
    //for getting the reponse code
    var respCode = response.statusCode;

    //for setting the background according to the weather forcast
    var bgColour = "regular";
    
    //if the weather information of the city is found (it went ok)
    if (respCode === 200) {
        response.on("data", function(data) {
            //getting the necessary data needed from the JSON returned by the API url
            const weatherData = JSON.parse(data)
            const temp = Math.round(weatherData.main.temp)
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const humidity = weatherData.main.humidity
            const feelsLike = Math.round(weatherData.main.feels_like)
            const visibility = (weatherData.visibility) / 1000
            const pressure = ((weatherData.main.pressure) * 0.1).toFixed(1)
            const windSpeed = Math.round((weatherData.wind.speed) * 3.6)
            const name = weatherData.name
            var imgUrl;
            
            //for getting the right image and background according to weather description
            switch(icon) {
                case "01d":
                    imgUrl = "img/1d.png";
                    bgColour = "oned";
                    break;
                case "01n":
                    imgUrl = "img/1n.png";
                    bgColour = "onen";
                    break;
                case "02d":
                    imgUrl = "img/2d.png";
                    bgColour = "twod";
                    break;
                case "02n":
                    imgUrl = "img/2n.png";
                    bgColour = "twon";
                    break;
                case "03d":
                    imgUrl = "img/2d.png";
                    bgColour = "twod";
                    break;
                case "03n":
                    imgUrl = "img/2n.png";
                    bgColour = "twon";
                    break;
                case "04d":
                    imgUrl = "img/4d.png";
                    bgColour = "fourd";
                    break;
                case "04n":
                    imgUrl = "img/4d.png";
                    bgColour = "fourn";
                    break;
                case "09d":
                    imgUrl = "img/9d.png";
                    bgColour = "nined";
                    break;
                case "09n":
                    imgUrl = "img/9d.png";
                    bgColour = "ninen";
                    break;
                case "10d":
                    imgUrl = "img/10d.png";
                    bgColour = "tend";
                    break;
                case "10n":
                    imgUrl = "img/9d.png";
                    bgColour = "ninen";
                    break;
                case "11d":
                    imgUrl = "img/11d.png";
                    bgColour = "elevend";
                    break;
                case "11n":
                    imgUrl = "img/11d.png";
                    bgColour = "elevenn";
                    break;
                case "13d":
                    imgUrl = "img/13d.png";
                    bgColour = "elevend";
                    break;
                case "13n":
                    imgUrl = "img/13d.png";
                    bgColour = "elevenn";
                    break;
                case "50d":
                    imgUrl = "img/50d.png";
                    bgColour = "fiftyd";
                    break;
                case "50n":
                    imgUrl = "img/50d.png";
                    bgColour = "fiftyn";
                    break;
                default:
                    imgUrl = "img/locationNotFound.png";
                    break;
            }      
            
            //sending all the data to the weather EJS file to display it
            res.render('weather.ejs',{currTemp : temp, weatherDesp : weatherDescription, hum : humidity, feelLike: feelsLike, visibKM : visibility, imageURL: imgUrl, statCode : respCode, windSp : windSpeed, pres:pressure, bodyColour:bgColour, locName:name}) 
        })

    }else {
        //if the weather information of the city is not found (it failed)
        res.render('weather.ejs',{statCode :respCode, bodyColour : bgColour}) 
    }      
})
})  


app.listen(3000, function() {
    console.log("Server is running on port 3000.")
})