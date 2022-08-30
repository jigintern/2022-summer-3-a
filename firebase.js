import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
// @deno-types="https://cdn.esm.sh/v58/firebase@9.4.1/firestore/dist/firestore/index.d.ts"
import {
    getFirestore,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"

const firebaseConfig = {
    apiKey: "AIzaSyC0OgKnDqQYYpC1CWowjO0korvax2bFpOE",
    authDomain: "running-ranking.firebaseapp.com",
    projectId: "running-ranking",
    storageBucket: "running-ranking.appspot.com",
    messagingSenderId: "660141883268",
    appId: "1:660141883268:web:fb085fe07d779f859da7d1",
    measurementId: "G-MQ2CVEQL0X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db