import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../firebase';

export async function getUserRecord(userId) {
    const docRef = doc(db, 'users', userId);
    const userDoc = await getDoc(docRef);
    return userDoc.data();
}

export async function signIn(credentials) {
    await signInWithEmailAndPassword(
        auth,
        credentials.username + '@talkoverdomain.com',
        credentials.password
    );
}
export async function signUp(credentials) {
    const { user } = await createUserWithEmailAndPassword(
        auth,
        credentials.username + '@talkoverdomain.com',
        credentials.password
    );

    console.log(user);

    await setDoc(
        doc(db, 'users', user.uid),
        createUserRecord(user.email, user.uid)
    );
}

function extractUsername(email) {
    return email.split('@').at(0);
}

function createUserRecord(email, id) {
    return {
        username: extractUsername(email),
        uid: id,
        bio: '',
        intruder: 'false',
        posts: 0,
        comments: [],
        role: 'user',
        joinedOn: serverTimestamp(),
    };
}

export function extractAuthErrorMessage(error) {
    const regex = /\(auth\/(?<type>.*)\)/g;
    const {
        groups: { type },
    } = regex.exec(error.message);

    return capitalizeFirstLetter(type).replaceAll('-', ' ') + '.';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
