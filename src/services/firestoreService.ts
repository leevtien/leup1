import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

// Định nghĩa kiểu dữ liệu sản phẩm
export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

// Thêm sản phẩm vào Firestore
export const addProduct = async (product: Product): Promise<string> => {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};

// Lấy danh sách sản phẩm
export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
};

// Lấy thông tin sản phẩm theo ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : null;
};
