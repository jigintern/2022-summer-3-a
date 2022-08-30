import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
// @deno-types="https://cdn.esm.sh/v58/firebase@9.4.1/firestore/dist/firestore/index.d.ts"
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    getFirestore,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"

const betUser = async (data) => {
    const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
}

export default betUser