const path = require('path');
const {google} = require('googleapis');
const moment = require('moment-timezone');
const fs = require('fs').promises;
const process = require('process');

const GOOGLE_CALENDAR_ID = process.env.CALENDAR_ID || '8f00cb9bcecd56397bb8c66dbbec915459b0dcb23c2c4091cca57ad96958a749@group.calendar.google.com';

const SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/admin.directory.resource.calendar"];
const TOKEN_PATH = path.join(process.cwd(), './secrets/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './secrets/credentials.json');
const timezone = 'Asia/Manila';

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}


exports.createEvent = async (requestBody, callback) => {
    try {
      authorize().then((auth) => {
        const calendar = google.calendar({ version: 'v3' });
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

exports.createEvent = async (requestBody, callback) => {
  try {
    authorize().then((auth) => {
      const calendar = google.calendar({ version: 'v3' });
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



exports.getEvents = async (requestBody, callback) => {
  try {
    authorize().then((auth) => {

      const day = requestBody.date;

      const startOfDay = moment.tz(`${day}T00:00:00`, timezone).toDate();
      const endOfDay = moment.tz(`${day}T23:59:59`, timezone).toDate();
      const timeMin = startOfDay.toISOString();
      const timeMax = endOfDay.toISOString();

      const calendar = google.calendar({ version: 'v3' });
      calendar.events.list({
        auth: auth,
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin: timeMin,
        timeMax: timeMax,
        timeZone: timezone,
        singleEvents: true,
        orderBy: 'startTime',
      }, function(err, res) {
          if (err) {
              callback({
                success: false,
                message : 'cannot get events',
                error: err
              })
          } else {
              callback({
                success: true,
                message: 'successfuly',
                result:  res.data.items
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