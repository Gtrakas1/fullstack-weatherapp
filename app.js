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

//const geoUrl = 'http://ip-api.com/json/?fields=status,message,city,lat,lon,query'
const currentUrl = 'https://api.openweathermap.org/data/2.5/'

require('dotenv').config();
const apiKey = process.env.API_KEY
const units = "metric"


app.get('/', function (req, res) {

    res.render('home')
})


app.post('/', function (req, res) {
    const city = req.body.cityName
    const weatherUrl = currentUrl + 'weather?q=' + city + '&units=' + units + '&appid=' + apiKey
    https.get(weatherUrl, function (response) {

        response.on("data", function (wdata) {
            const weatherData = JSON.parse(wdata)
            const query = city;
            const icon = weatherData.weather[0].icon
            const temp = Math.ceil(weatherData.main.temp);
            const descritption = weatherData.weather[0].description

            res.render('weather', {
                //currentData
                query: query,
                icon: icon,
                description: descritption,
                temp: temp,
            })
        })
    })
    app.get('/daily', function (req, res) {
        const dailyWeatherUrl = currentUrl + 'forecast?q=' + city + '&units=' + units + '&appid=' + apiKey
        console.log(city)
        https.get(dailyWeatherUrl, function (response) {
            response.on("data", function (wdata) {
                const weatherData = JSON.parse(wdata)


                const dailyData = weatherData.list.map(daily => {
                    return daily;
                })

                // const icon = weatherData.hourly.weather[0].icon
                // const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                // const temp = weatherData.hourly.temp;
                // const descritption = weatherData.hourly.weather[0].description
                res.render('daily', {
                    dailyData: dailyData,
                })
            })
        })
    })


})





app.post('/daily', function (req, res) {
    const city = req.body.cityName
    const dailyWeatherUrl = currentUrl + 'forecast?q=' + city + '&units=' + units + '&appid=' + apiKey
    console.log(city)
    https.get(dailyWeatherUrl, function (response) {
        response.on("data", function (wdata) {
            const weatherData = JSON.parse(wdata)


            const dailyData = weatherData.list.map(daily => {
                return daily;
            })

            // const icon = weatherData.hourly.weather[0].icon
            // const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            // const temp = weatherData.hourly.temp;
            // const descritption = weatherData.hourly.weather[0].description
            res.render('daily', {
                dailyData: dailyData,
            })
        })
    })
})



// // hourly weather forcast

// app.get('/hourly', function (req, res) {
//     http.get(geoUrl, function (respond) {
//         respond.on("data", function (data) {
//             const locationData = JSON.parse(data);
//             const currentWeatherUrl = onecallUrl + '?lat=' + locationData.lat + '&lon=' + locationData.lon + '&units=' + units + '&exclude=current,minutely,daily,alerts&appid=' + apiKey
//             https.get(currentWeatherUrl, function (response) {
//                 response.on("data", function (wdata) {
//                     const weatherData = JSON.parse(wdata)
//                     const hourlyData = weatherData.hourly.filter((hour, idx) =>
//                         idx < 40
//                     ).map(hour => {
//                         return hour
//                     }

//                     )
//                     // const icon = weatherData.hourly.weather[0].icon
//                     // const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
//                     // const temp = weatherData.hourly.temp;
//                     // const descritption = weatherData.hourly.weather[0].description

//                     res.render('hourly', {
//                         // query: query,
//                         // icon: icon,
//                         hourlyData: hourlyData
//                         //temp: temp

//                     })
//                 })
//             })
//         })
//     })
// })



// //lat: 43.64
// //lon: -79.433



app.listen(3000, function () {
    console.log("Running on port 3000")
})

