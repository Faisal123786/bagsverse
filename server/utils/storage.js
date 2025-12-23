const AWS = require('aws-sdk');

const keys = require('../config/keys');

exports.s3Upload = async image => {
  try {
    let imageUrl = '';
    let imageKey = '';

    if (!keys.aws.accessKeyId) {
      console.warn('Missing aws keys');
    }

    if (image) {
      const s3bucket = new AWS.S3({
        accessKeyId: keys.aws.accessKeyId,
        secretAccessKey: keys.aws.secretAccessKey,
        region: keys.aws.region
      });

      const params = {
        Bucket: keys.aws.bucketName,
        Key: image.originalname,
        Body: image.buffer,
        ContentType: image.mimetype
      };

      const s3Upload = await s3bucket.upload(params).promise();

      imageUrl = s3Upload.Location;
      imageKey = s3Upload.key;
    }

    return { imageUrl, imageKey };
  } catch (error) {
    return { imageUrl: '', imageKey: '' };
  }
};

// NEW: S3 Delete function
exports.s3Delete = async imageKey => {
  try {
    if (!keys.aws.accessKeyId) {
      console.warn('Missing aws keys');
      return { success: false, message: 'Missing AWS keys' };
    }

    if (!imageKey) {
      console.warn('No image key provided');
      return { success: false, message: 'No image key provided' };
    }

    const s3bucket = new AWS.S3({
      accessKeyId: keys.aws.accessKeyId,
      secretAccessKey: keys.aws.secretAccessKey,
      region: keys.aws.region
    });

    const params = {
      Bucket: keys.aws.bucketName,
      Key: imageKey
    };

    await s3bucket.deleteObject(params).promise();

    console.log(`Successfully deleted image: ${imageKey}`);
    return { success: true, message: `Image ${imageKey} deleted successfully` };
  } catch (error) {
    console.error('S3 Delete Error:', error);
    return { success: false, message: error.message };
  }
};
