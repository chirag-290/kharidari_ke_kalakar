






const { ImageAnnotatorClient } = require('@google-cloud/vision');
const fs = require('fs');
const { google } = require('googleapis');

// Set the environment variable pointing to your service account key file
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'shopcluehacathhon-b0de7ac55a8c.json';

// Google Sheets API credentials
const credentials = require('./shopcluehacathhon-b0de7ac55a8c.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
);

async function detectLabelsAndWriteToSheet(path) {
    // Creates a client for Vision API
    const visionClient = new ImageAnnotatorClient();

    // Reads the image file
    const content = fs.readFileSync(path);

    // Detects labels in the image
    const [result] = await visionClient.labelDetection(Buffer.from(content));
    const labels = result.labelAnnotations.map(label => label.description);

    // Write labels to Google Sheets
    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = '1_a7xrkeb_86F-3UXb1Fy6QCjcp4NFZRl9WohHAFyAYw';
    const range = 'Sheet1!A1'; // Change the range as needed

    try {
        // Retrieve existing data range
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        // Determine the next empty row
        const nextRow = response.data.values ? response.data.values.length + 1 : 1;
        const newRange = `Sheet1!A${nextRow}`;

        // Prepare request body
        const requestBody = {
            values: [labels]
        };

        // Append new data
        const appendResponse = await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: newRange,
            valueInputOption: 'RAW',
            requestBody: requestBody,
            insertDataOption: 'INSERT_ROWS'
        });

        console.log(`${appendResponse.data.updates.updatedCells} cells appended.`);
    } catch (error) {
        console.error('Error updating Google Sheets:', error);
    }
}

detectLabelsAndWriteToSheet('jeans.jpg').catch(err => {
    console.error('Error:', err);
});
