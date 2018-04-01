const admin = require("firebase-admin");
const http = require('http');
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

// Fetch the service account key JSON file contents
const serviceAccount = require("./a1c6750abdc81.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Add/update user preference (from Twilio text) to Firebase
function addToFreqs(item) {
    const freqRef = db.collection('users').doc(item);

    const current = freqRef.get()
        .then(doc => {
            const newFreq = doc.data() ? doc.data()['freq'] + 1 : 1;
            const updateFreq = freqRef.set({ freq: newFreq });
            console.log("the item " + item + " has frequency " + newFreq);
        }).catch(err => {
        console.log('Error getting document', err);
    });
}

function getTopThree() {
    const freqRef = db.collection('users');
    const firstThree = freqRef.orderBy('freq', 'desc').limit(3);

    // const citiesRef = db.collection('cities');
    // const first = citiesRef.where('population', '>', 2500000).orderBy('population');

    return Promise.all([firstThree.get()]).then(res => {
        res.forEach(r => {
            r.forEach(d => {
                console.log('Get:', d);
            });
            console.log();
        });
    });
}

module.exports = {
    addToFreqs,
    getTopThree,
}

// // Adds new menu item to Firestore database
// getMenuItem().then(result => {
//     console.log(result.body);
//     const obj = JSON.parse(result.body);
//     const itemData = {
//         name: obj.name,
//         description: obj.description,
//         tags: obj.tags
//     }
//     return db.collection('menuData').doc('bruinPlate').set(itemData).then(() => {
//         console.log('new menu item written to data base');
//     })
// });

// gets JSON from submitted form
function getMenuItem(req, res) {
    let descr, name;

    if (req.body.name.length > 0)
    {
        name = req.body.name;
    } else {
        name = "Unnamed item";
    }

    if (req.body.description.length > 0)
    {
        descr = req.body.description;
    } else {
        descr = req.body.name;
    }

    const tags = req.body.tags.split(',');

    const newItem = {name: name, description: descr, tags: tags};

    return newItem;
}
