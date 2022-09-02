import {
    doc,
    getDoc,
    Timestamp
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

    var st = Timestamp.now().toDate();
    var year = st.getFullYear();
    var month = st.getMonth() + 1 ;
    var date = st.getDate() ;
    month = ("0" + month).slice(-2);
    date = ("0" + date).slice(-2);     
    const datekey = year + "-" + month + "-" + date;
    var todaysrunning = 0;
    if(targetRes.data().runninglog[datekey]!=null)
    {
        todaysrunning = targetRes.data().runninglog[datekey].distance;
    }

    data.betrp.lastbet = data.betrp.lastbet.toDate()
    const senddata = 
    {
        name:data.name,
        birthday:data.birthday.toDate(),
        level:data.level,
        todaysrunning:todaysrunning,
        rp:data.rp,
        betrp:data.betrp,
        gambling:data.gambling,
        isgamble:isgamble,
        lastrun:data.lastrun.toDate(),
        data:data.betdate.toDate()
    };
    return new Response(JSON.stringify(senddata), 
        {
        headers: {
            "content-type": "application/json"
        },

    });
}

export default getUser