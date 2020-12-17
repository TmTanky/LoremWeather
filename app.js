require('dotenv').config()
const express = require(`express`)
const bodyParser = require(`body-parser`)
const ejs = require(`ejs`)
const mongoose = require(`mongoose`)
const axios = require(`axios`).default


const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set(`view engine`, `ejs`)
app.use(express.static(`public`))

mongoose.connect(`mongodb+srv://TmAdmin:${process.env.PASSWORD}@cluster0.c7khy.mongodb.net/WeatherDB?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

const emailSchema = new mongoose.Schema({
    email: String,
    message: String
})

const feedback = new mongoose.model(`feedback`, emailSchema)

function getYear() {
    const date = new Date()
    return year = date.getFullYear()
}

const yearNow = getYear()

app.get(`/`, (req, res) => {
    res.render(`main`, {year: yearNow})
})

app.post(`/`, (req, res) => {

    let location = req.body.loc

    if (!location) {
        location = "Philippines"
    } else {
        location
    }

    function getWeather() {

        const url = `http://api.openweathermap.org/data/2.5/weather?q=${location},&APPID=ac6be1975e351fdc78062be11613eb74&units=metric`

        return axios.get(url)
    }
    getWeather().then((info) => {
        const wholeData = info.data
        const countryName = wholeData.name.toUpperCase()
        const illus = wholeData.weather[0].description.toUpperCase()

        const icon = wholeData.weather[0].icon
        
        const temp = wholeData.main.temp
        const count = wholeData.sys.country

        console.log(count)

        res.render(`index`, {country: countryName, illus: illus, image: icon, year: yearNow , temper: temp, countryHome: count})
    })
    .catch((err) => {
        console.log(err)
        res.send(404)
    })

})

app.get(`/contact`, (req, res) => {

    res.render(`contact`, {year: yearNow})
    
})

app.post(`/contact`, (req, res) => {

    const emailMan = req.body.emailers
    const messageMan = req.body.msg

    const feedbackProc = new feedback ({
        email: emailMan,
        message: messageMan
    })

    if (!emailMan && !messageMan) {
        res.redirect(`/failed`)
    } else if (emailMan && !messageMan) {
        res.redirect(`/failed`)
    } else if (!emailMan && messageMan) {
        res.redirect(`/failed`)
    } else {
        feedbackProc.save()
        res.redirect(`/`)
    }

    // if (feedbackProc) {
    //     feedbackProc.save()
    //     res.redirect(`/contact`)
    // } else {
    //     res.send(res.status(404))
    //     console.log(`Error`)
    // }

})

app.get(`/lorem`, (req, res) => {

    res.render(`lorem`, {year: yearNow})

})

app.get(`/failed`, (req, res) => {
    res.render(`failed`, {year: yearNow})
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running`)
})