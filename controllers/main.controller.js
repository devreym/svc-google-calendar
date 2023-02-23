const credentials = require('../configs/credentials.js');
const configs = require('../configs/configs.js');
const path = require('path');

const {google} = require('googleapis');


const event = {
    'summary': 'TEST BOOKING',
    'location': 'Studio Sai Zacarias',
    'description': 'Booking Reservation',
    'start': {
      'dateTime': new Date().toISOString(),
      'timeZone': 'Asia/Manila',
    },
    'end': {
      'dateTime': '2023-05-28T17:00:00-07:00',
      'timeZone': 'Asia/Manila',
    },
    'reminders': {
      'useDefault': true
    },
};
  
exports.createEvent = async (requestBody, callback) => {
    try {
        const client = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
           [ // set the right scope
              'https://www.googleapis.com/auth/calendar',
              'https://www.googleapis.com/auth/calendar.events',
            ],
        );

        const calendar = google.calendar({ version: 'v3' });
        calendar.events.insert({
            calendarId: configs.calendarId,
            auth: client,
            requestBody: requestBody,
        }, function(err, event) {
            if (err) {
                callback({
                  message : 'cannot create event ' + err,
                })

            } else {
              console.log('done')
                callback({
                  message: 'link' +  event.htmlLink
                })
            }
        });
    } catch(err) {
        callback({
          error: 'error' + err
        })
    }
}
