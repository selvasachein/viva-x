const admin = require("firebase-admin");

const serviceAccount = require("./viva-x-smart-queue-firebase-adminsdk-fbsvc-feaf8c29ce.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = "SWDUPKojlqg5cXt72GxSZ7zco443";

admin.auth().setCustomUserClaims(uid, {
  admin: true
}).then(() => {
  console.log("Admin role assigned");
  process.exit();
});