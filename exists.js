import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const exists  = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef)
    if(userDoc.exists()){
    return new Response(JSON.stringify({exists:true}), 
            {
            headers: {
                "content-type": "application/json"
            },
        });
    }else{
        return new Response(JSON.stringify({exists:false}), 
            {
            headers: {
                "content-type": "application/json"
            },
        });
    }
}

export default exists