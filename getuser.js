import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const getUser  = async (uid,targetuid) => {
    const FirstRef = doc(db, "users", targetuid);
    const firstRes = await getDoc(FirstRef);
    const data = firstRes.data();
    let gRef;
    let gRes;
    let count = 0;
    for(let gdata of data.gambling)
    {
        let guid = gdata.uid;
        gRef = doc(db, "users", guid);
        gRes = await getDoc(gRef);
        data.gambling[count].name = gRes.data().name;
        data.gambling[count].level = gRes.data().level;
        count ++;
    }

    const myRef= doc(db, "users",uid);
    const myRes = await getDoc(myRef);
    const gamblingList = myRes.data().gambling;
    let isgamble = false;
    for(let gambleData of gamblingList)
    {
        if(gambleData.uid == targetuid)
        {
            isgamble = true;
            break;
        }
    }
    data.isgamble = isgamble;
    return new Response(JSON.stringify(data), 
        {
        headers: {
            "content-type": "application/json"
        },

    });
}

export default getUser