importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyAsPE7UwcsLRyDExYHtyAnF9hBgr0Z0lKc",
  authDomain: "ecommerce-22984.firebaseapp.com",
  projectId: "ecommerce-22984",
  storageBucket: "ecommerce-22984.firebasestorage.app",
  messagingSenderId: "982247400347",
  appId: "1:982247400347:web:9fec7244a2678b5604773e",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
