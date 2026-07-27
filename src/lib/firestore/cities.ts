import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { SavedCity } from "@/types/user";

const COLLECTION = "savedCities";

export async function getSavedCities(uid: string): Promise<SavedCity[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", uid),
    orderBy("savedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    name: d.data().name as string,
    lat: d.data().lat as number,
    lon: d.data().lon as number,
    savedAt: d.data().savedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  }));
}

export async function saveCity(
  uid: string,
  city: Omit<SavedCity, "id" | "savedAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    userId: uid,
    name: city.name,
    lat: city.lat,
    lon: city.lon,
    savedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteCity(docId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, docId));
}

export async function isCitySaved(
  uid: string,
  lat: number,
  lon: number
): Promise<string | null> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", uid),
    where("lat", "==", lat),
    where("lon", "==", lon)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
}
