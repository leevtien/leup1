import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebaseConfig";

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, // Thêm VAPID Key
    });

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("FCM Error:", error);
    return null;
  }
};
