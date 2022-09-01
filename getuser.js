import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const getUser  = async (uid,targetuid) => {
    const targetRef = doc(db, "users", targetuid);
    const targetRes = await getDoc(targetRef);
    const data = targetRes.data();
    let gRef;
    let gRes;
    let count=0;
    const results = await Promise.all(data.gambling.map(async (gdata) => {
        let guid = gdata.uid;
        gRef = doc(db, "users", guid);
        gRes = await getDoc(gRef);
        data.gambling[count].name = gRes.data().name;
        data.gambling[count].level = gRes.data().level;
        count ++;
    }));

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
    data.birthday = data.birthday.toDate()
    data.lastrun = data.lastrun.toDate()
    data.betdate = data.betdate.toDate()
    data.betrp.lastbet = data.betrp.lastbet.toDate()
    return new Response(JSON.stringify(data), 
        {
        headers: {
            "content-type": "application/json"
        },

    });
}

export default getUser