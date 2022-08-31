import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const getUsers  = async (uid,key) => {
    const userDocs = await getDocs(collection(db, "users"))
    const users = []
    userDocs.forEach((doc) => {
        users.push({
            uid:doc.id,
            name:doc.data().name,
            level:doc.data().level,
            continuation:doc.data().continuation,
            distance:doc.data().distance,
        })
    })
    console.log(users)
    /*return new Response(JSON.stringify(data), 
        {
        headers: {
            "content-type": "application/json"
        },

    });*/
}

export default getUsers