import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const getUser  = async (uid) => {
    const FirstRef = doc(db, "users", uid);
    const firstRes = await getDoc(FirstRef)
    const user = firstRes.data()
    console.log(user)
    return user
}

export default getUser