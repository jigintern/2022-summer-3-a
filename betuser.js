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
        return new Response("先に賭けの結果を清算してください",{
            status:400
        })
    }
    else if(data.wager > user.rp){
        return new Response("所持RPより大きな額は賭けれません",{
            status:400
        })
    }
    else if(lastrun >= 7){
        return new Response("最後に走ってから1週間以上経過している人には賭けれません",{
            status:400
        })
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
    return new Response(200,{status:200});
}

export default betUser