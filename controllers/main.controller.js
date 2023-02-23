const path = require('path');
const {google} = require('googleapis');
require("dotenv").config();

const GOOGLE_PRIVATE_KEY = process.env.PRIVATE_KEY;
const GOOGLE_CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const GOOGLE_PROJECT_NUMBER = process.env.PROJECT_NUMBER;
const GOOGLE_CALENDAR_ID = process.env.CALENDAR_ID;


const SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/admin.directory.resource.calendar"];
const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const auth = new google.auth.GoogleAuth({
  keyFile: "./keys.json",
  scopes: SCOPES
});


exports.createEvent = async (requestBody, callback) => {
    try {
      auth.getClient().then((auth) => {
        // const calendar = google.calendar({ version: 'v3' });
        calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            auth: auth,
            requestBody: requestBody,
        }, function(err, event) {
            if (err) {
                callback({
                  success: false,
                  message : 'cannot create event',
                  error: err
                })
            } else {
              console.log('done')
                callback({
                  success: true,
                  message: 'sucessfully created an event ' +  event.data.htmlLink,
                  result:  event.data,
                })
            }
        });
      });
    } catch(err) {
        callback({
          error: err
        })
    }
}

