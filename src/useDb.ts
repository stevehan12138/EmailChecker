import { initializeApp } from 'firebase/app'
import { getFirestore, collection, CollectionReference, DocumentData } from 'firebase/firestore'
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

interface Server {
    domains: string[];
    users: {
        [userId: string]: {
            email: string;
            code: string;
            verified: boolean;
        }
    }
}

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)

export const serversCol = collection(firestore, 'servers') as CollectionReference<Server>