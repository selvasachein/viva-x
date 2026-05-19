const admin = require("firebase-admin");

const serviceAccount = require("./viva-x-smart-queue-firebase-adminsdk-fbsvc-2229ec3573");

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