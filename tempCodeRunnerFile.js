
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const fs = require('fs');

// Set the environment variable pointing to your service account key file
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'shopcluehacathhon-b0de7ac55a8c.json';

async function detectLabels(path) {
    // Creates a client
    const client = new ImageAnnotatorClient();

    // Reads the image file
    const content = fs.readFileSync(path);

    // Detects labels in the image
    const [result] = await client.labelDetection(Buffer.from(content));
    const labels = result.labelAnnotations;

    console.log('Labels:');
    labels.forEach(label => {
        console.log(label.description);
    });

    if (result.error && result.error.message) {
        throw new Error(`${result.error.message}\nFor more info on error messages, check: https://cloud.google.com/apis/design/errors`);
    }
}

detectLabels('tshirt.jpg')
    .catch(err => {
        console.error('Error:', err);
    });