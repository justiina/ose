import { addDoc, collection, DocumentData } from "firebase/firestore";
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
