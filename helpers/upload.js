import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});
const bucketName = process.env.GOOGLE_BUCKET_NAME;

export async function uploadFileToGCS(filePath, fileName) {
  try {
    const [file] = await storage.bucket(bucketName).upload(filePath, {
      destination: fileName,
    });
    return file.publicUrl();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function downloadFileFromGCS(fileName, destinationPath) {
  try {
    await storage.bucket(bucketName).file(fileName).download({
      destination: destinationPath,
    });
    console.log('File downloaded successfully');
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}
