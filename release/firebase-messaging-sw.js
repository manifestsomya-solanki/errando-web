// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAiFWJ2KbaBth5pX3Rv084a6mhUHPUsP34",
  authDomain: "erranddo-36cbc.firebaseapp.com",
  projectId: "erranddo-36cbc",
  storageBucket: "erranddo-36cbc.appspot.com",
  messagingSenderId: "715070118259",
  appId: "1:715070118259:web:52fc23bee61f6fce940d06",
  measurementId: "G-8X4TWTJKE3",
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
