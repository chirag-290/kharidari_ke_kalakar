// const { ImageAnnotatorClient } = require('@google-cloud/vision');
// const fs = require('fs');

// // Set the environment variable pointing to your service account key file
// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'shopcluehacathhon-b0de7ac55a8c.json';

// async function detectLabels(path) {
//     // Creates a client
//     const client = new ImageAnnotatorClient();

//     // Reads the image file
//     const content = fs.readFileSync(path);

//     // Detects labels in the image
//     const [result] = await client.labelDetection(Buffer.from(content));
//     const labels = result.labelAnnotations;

//     console.log('Labels:');
//     labels.forEach(label => {
//         console.log(label.description);
//     });

//     if (result.error && result.error.message) {
//         throw new Error(`${result.error.message}\nFor more info on error messages, check: https://cloud.google.com/apis/design/errors`);
//     }
// }

// detectLabels('image1.jpg')
//     .catch(err => {
//         console.error('Error:', err);
//     }); 


async function fetchImageURL(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const imageUrl = e.target.result;
        console.log("Uploaded image URL:", imageUrl);
        await detectLabels(imageUrl);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async function detectLabels(imageUrl) {
    const requestBody = {
      requests: [
        {
          image: { source: { imageUri: imageUrl } },
          features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
        },
      ],
    };

    try {
      const response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
          (await getApiKey())
      );
      const data = await response.json();

      console.log("Labels:");
      data.responses[0].labelAnnotations.forEach((label) => {
        console.log(label.description);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getApiKey() {
    // Fetch the API key from the JSON file
    const response = await fetch("shopcluehacathhon-b0de7ac55a8c.json");
    const jsonData = await response.json();
    return jsonData.private_key;
  }