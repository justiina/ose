import { addDoc, collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

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
    const querySnapshot = await getDocs(collection(db, collectionName));
    const eventData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data() as DocumentData);
    });
    return eventData;
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};
