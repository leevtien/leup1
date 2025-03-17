import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";

// Tải ảnh lên Storage và trả về URL
export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `products/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
