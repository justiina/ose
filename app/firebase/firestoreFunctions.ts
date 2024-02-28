import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import toast from "react-hot-toast";

export const saveEvent = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<boolean | any> => {
  try {
    await addDoc(collection(db, collectionName), data);
    return true;
  } catch (error) {
    console.log("Something went wrong: ", error);
    return error;
  }
};

export const getEvents = async (
  collectionName: string
): Promise<DocumentData | null> => {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy("time"),
      orderBy("type"))
    const querySnapshot = await getDocs(q);
    const eventData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data() as DocumentData);
    });
    return eventData;
  } catch (error) {
    console.error("Error getting document:", error);
    toast.error(
      "Tapahtumien lataus ei onnistunut! Yritä myöhemmin uudestaan.",
      { id: "download" }
    );
    return null;
  }
};

export const getEventsByDate = async (
  collectionName: string,
  date: string
): Promise<DocumentData | null> => {
  try {
    const q = query(
      collection(db, collectionName),
      where("date", "==", date),
      orderBy("time"),
      orderBy("type")
    );
    const querySnapshot = await getDocs(q);
    const eventData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data() as DocumentData);
    });
    return eventData;
  } catch (error) {
    console.error("Error getting document:", error);
    toast.error(
      "Tapahtumien lataus ei onnistunut! Yritä myöhemmin uudestaan.",
      { id: "download" }
    );
    return null;
  }
};
