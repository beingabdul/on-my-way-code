var express = require('express')
var cors = require("cors")
var app = express()

app.use(cors({ origin: true }))

var expressLayouts = require('express-ejs-layouts')

app.set('view engine', 'ejs')

app.use(expressLayouts)
app.use(express.static('public'))
app.set('layout', 'layouts/layout')

// index page
app.get('', function(req, res) {
    res.render('index')
})
app.get('/index', function(req, res) {
    res.render('index')
})
app.get('/adminGroup', function(req, res) {
    res.render('adminGroup')
})

app.get('/admin', function(req, res) {
    res.render('admin')
})

app.get('/users', function(req, res) {
    res.render('users')
})

app.get('/serviceProvider', function(req, res) {
    res.render('serviceProvider')
})

app.get('/manualBooking', function(req, res) {
    res.render('manualBooking')
})

app.get('/salesReport', function(req, res) {
    res.render('salesReport')
})

app.get('/sendNotification', function(req, res) {
    res.render('sendNotification')
})

app.get('/settings', function(req, res) {
    res.render('settings')
})

app.get('/serviceCategory', function(req, res) {
    res.render('serviceCategory')
})

app.get('/services', function(req, res) {
    res.render('services')
})

app.get('/carType', function(req, res) {
    res.render('carType')
})

app.get('/carModel', function(req, res) {
    res.render('carModel')
})

app.get('/carMake', function(req, res) {
    res.render('carMake')
})

app.get('/booking', function(req, res) {
    res.render('booking')
})

app.get('/bookings', function(req, res) {
    res.render('bookings')
})

app.get('/reviews', function(req, res) {
    res.render('reviews')
})
app.get('/supportRequest', function(req, res) {
    res.render('supportRequest')
})
app.get('/promotions', function(req, res) {
    res.render('promotions')
})
app.get('/promoCodes', function(req, res) {
    res.render('promoCodes')
})
app.get('/banners', function(req, res) {
    res.render('banners')
})
app.get('/userCars', function(req, res) {
    res.render('userCars')
})

app.listen(5000, () => {
    console.log('🚀Server listening on port 5000')
})