import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const betUser  = async (data) => {
    const userRef = doc(db, "users", data["uid"]);
    const userDoc = await getDoc(userRef)
    const user = userDoc.data()
    const targetRef = doc(db,"users",data.targetid)
    const targetDoc = await getDoc(targetRef)
    const target = targetDoc.data()
    const today = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const todate = today.getFullYear() + "/" +  (today.getMonth() + 1) + "/"+ today.getDate();
    const betday = new Date(user["gambling"]["betdate"].toDate() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
    const betdate = betday.getFullYear() + "/" +  (betday.getMonth() + 1) + "/"+ betday.getDate();
    const lastrun = (today - new Date(target.lastrun.toDate() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000)))/ 1000 / 60 / 60 / 24
    if(todate !== betdate){
        return 1
    }
    else if(data.wager > user.rp){
        return 2
    }
    else if(lastrun >= 7){
        return 3
    }
    user["gambling"][data.targetid] = {
        betting:data.betting,
        name:target.name,
        wager:data.wager
    }
    user["gambling"]["betdate"] = today
    const lastbet = new Date(target["betrp"]["lastbet"].toDate() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const lastbetdate = lastbet.getFullYear() + "/" +  (lastbet.getMonth() + 1) + "/"+ lastbet.getDate();
    if(todate !== lastbetdate){
        target["betrp"] = {
            clear:0,
            fail:0,
            lastbet:today
        }
    }
    if(data.betting){
        target["betrp"]["clear"] += data.wager
    }else{
        target["betrp"]["fail"] += data.wager
    }
    user.rp -= data.wager
    target["betrp"]["lastbet"] = today
    await setDoc(userRef,user)
    await setDoc(targetRef,target)
    //console.log(user)
    //console.log(target)
    return 0
}

export default betUser