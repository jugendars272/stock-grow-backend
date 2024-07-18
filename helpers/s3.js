const AWS = require('aws-sdk');
const fs = require("fs");

// Create an instance of the AWS S3 service
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Function to upload an image to AWS S3
const uploadImageToS3 = async (imageData, fileName, folderName) => {
  try {
    // Generate a unique filename for the image using the speaker ID
    const filename = `${fileName}.jpg`;
    // Specify the parameters for uploading the image to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${folderName}/${filename}`, // Folder name + filename
      Body: imageData, // The actual image data
      ACL: 'public-read', // Make the uploaded file publicly readable
      ContentType: 'image/jpeg' // Specify the content type of the file
    };

    // Upload the image to S3 and await the result
    const uploadResult = await s3.upload(uploadParams).promise();

    // Return the URL of the uploaded image
    return uploadResult.Location;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
};

module.exports = { uploadImageToS3 };
