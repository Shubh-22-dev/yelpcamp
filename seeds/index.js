const mongoose = require('mongoose');
const axios = require('axios')
const campground = require('../models/campground');
const cities = require('./cities')
const {
    places,
    descriptors
} = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6251a261b0f86b3e7348df90',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: await seedImg(),
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat nostrum delectus non numquam magni vero dolorum doloremque reprehenderit libero corrupti magnam minima amet, vel quos quis maxime incidunt ea in!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [{
                    url: 'https://res.cloudinary.com/dx5bqsdzo/image/upload/v1649660952/YelpCamp/wx8orwsyloinubfbnnvw.jpg',
                    filename: 'YelpCamp/wx8orwsyloinubfbnnvw',
                },
                {
                    url: 'https://res.cloudinary.com/dx5bqsdzo/image/upload/v1649660953/YelpCamp/brmuk68gtbakf4h1rrnp.jpg',
                    filename: 'YelpCamp/brmuk68gtbakf4h1rrnp',
                }
            ],
        })
        await camp.save()
    }
}

// call unsplash and return small image
async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: '2-1ysv31rUuDB8bnHI4zZYvTaBTw_x1tQVIyNfeeBZ8',
                collections: 483251,
            },
        })
        return resp.data.urls.regular
    } catch (err) {
        console.error(err)
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})