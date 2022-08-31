import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const postUser  = async (data) => {
    const userRef = doc(db, "users", data.uid);
    const userDoc = await getDoc(userRef)
    if(userDoc.exists()){
        const user = userDoc.data()
        user.name = data.name
        user.level = user.level
        setDoc(userRef,user)
    }
    else{
        const user = {
            betdate:new Date(),
            betrp:{
                clear:0,
                fail:0,
                lastbet:new Date()
            },
            birthday:new Date(data.birthday),
            gambling:[],
            lastrun:new Date(),
            level:data.level,
            continuation:0,
            maxcontinuation:0,
            name:data.name,
            rp:1000,
            runninglog:[]
        }
        setDoc(userRef,user)
    }
    const newuserDoc = await getDoc(userRef)
    const newuser = newuserDoc.data()
    return new Response(JSON.stringify(newuser),{
        headers:{
            "content-type": "application/json"
        }
    })
}

export default postUser