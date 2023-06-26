import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function getUserRecord(userId) {
    const docRef = doc(db, 'users', userId);
    const userDoc = await getDoc(docRef);
    return userDoc.data();
}
