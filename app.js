const express = require("express");
const https = require("https");
const http = require('http')
const bodyParser = require("body-parser");
const ejs = require('ejs');
const { response } = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.set('view engine', 'ejs')

const geoUrl = 'http://ip-api.com/json/?fields=status,message,city,lat,lon'
const onecallUrl = 'https://api.openweathermap.org/data/2.5/onecall'
require('dotenv').config();
const apiKey = process.env.API_KEY
const units = "metric"
// get request for current location
app.get("/", function (req, res) {
    const query = "Toronto"

    var city = getLocation(city);
    console.log(city)

    http.get(geoUrl, function (respond) {
        respond.on("data", function (data) {
            const locationData = JSON.parse(data);
            const currentWeatherUrl = onecallUrl + '?lat=' + locationData.lat + '&lon=' + locationData.lon + '&units=' + units + '&exclude=minutely,hourly,daily&appid=' + apiKey

            https.get(currentWeatherUrl, function (response) {
                response.on("data", function (wdata) {
                    const weatherData = JSON.parse(wdata)
                    const icon = weatherData.current.weather[0].icon
                    const temp = weatherData.current.temp;
                    const descritption = weatherData.current.weather[0].description

                    res.render('weather', {
                        query: query,
                        icon: icon,
                        description: descritption,
                        temp: temp

                    })
                })
            })
        })
    })
})

// hourly weather forcast

app.get('/hourly', function (req, res) {
    http.get(geoUrl, function (respond) {
        respond.on("data", function (data) {
            const locationData = JSON.parse(data);
            const currentWeatherUrl = onecallUrl + '?lat=' + locationData.lat + '&lon=' + locationData.lon + '&units=' + units + '&exclude=current,minutely,daily,alerts&appid=' + apiKey
            https.get(currentWeatherUrl, function (response) {
                response.on("data", function (wdata) {
                    const weatherData = JSON.parse(wdata)
                    const hourlyData = weatherData.hourly.filter((hour, idx) =>
                        idx < 40
                    ).map(hour => {
                        return hour
                    }

                    )
                    // const icon = weatherData.hourly.weather[0].icon
                    // const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                    // const temp = weatherData.hourly.temp;
                    // const descritption = weatherData.hourly.weather[0].description

                    res.render('hourly', {
                        // query: query,
                        // icon: icon,
                        hourlyData: hourlyData
                        //temp: temp

                    })
                })
            })
        })
    })
})

app.get('/daily', function (req, res) {
    http.get(geoUrl, function (respond) {
        respond.on("data", function (data) {
            const locationData = JSON.parse(data);
            const currentWeatherUrl = onecallUrl + '?lat=' + locationData.lat + '&lon=' + locationData.lon + '&units=' + units + '&exclude=current,minutely,hourly,alerts&appid=' + apiKey
            https.get(currentWeatherUrl, function (response) {
                response.on("data", function (wdata) {
                    const weatherData = JSON.parse(wdata)

                    const dailyData = weatherData.daily.map(daily => {
                        return daily;
                    })

                    // const icon = weatherData.hourly.weather[0].icon
                    // const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                    // const temp = weatherData.hourly.temp;
                    // const descritption = weatherData.hourly.weather[0].description
                    const tempData = weatherData.daily.map(daily => {
                        return daily.temp
                    })
                    console.log(tempData)
                    res.render('daily', {
                        // query: query,
                        dailyData: dailyData,
                        tempData: tempData
                        //temp: temp

                    })
                })
            })
        })
    })
})

//lat: 43.64
//lon: -79.433
app.post('/', function (req, res) {

    const query = req.body.cityName
    const units = "metric"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units

    https.get(url, function (response) {

        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const icon = weatherData.weather[0].icon
            const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png" + "alt=icon-img"
            const temp = weatherData.main.temp;
            const descritption = weatherData.weather[0].description

            res.render('weather', {
                query: query,
                icon: icon,
                description: descritption,
                temp: temp
            })


        })
    })


})



app.listen(3000, function () {
    console.log("Running on port 3000")
})
