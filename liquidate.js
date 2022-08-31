import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const liquidate  = async (uid) => {
    const userRef = doc(db,"users",uid);
    const userDoc = await getDoc(userRef);
    const user = userDoc.data();
    var pl = 0
    const betday = new Date(user["betdate"].toDate() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
    const betdate = betday.getFullYear() + "-" +  ('0' + (betday.getMonth() + 1)).slice(-2) + "-"+ ('0' + betday.getDate()).slice(-2);
    const results = await Promise.all(user.gambling.map(async (gamble) => {
        const targetRef = doc(db,"users",gamble.uid)
        const targetDoc = await getDoc(targetRef)
        const target = targetDoc.data()
        if(target.runninglog[betdate]["cleared"] === gamble.betting){
            pl += gamble.wager * 1.9;
            return {
                name:target.name,
                bet:gamble.betting,
                isWin:true,
                fluctuation:gamble.wager * 1.9
            }
        }
        else{
            return {
                name:target.name,
                bet:gamble.betting,
                isWin:false,
                fluctuation:-gamble.wager
            }
        }
    }));
    user.gambling = [];
    user.rp += pl;
    await setDoc(userRef,user)
    const res = {
        results:results,
        pl:pl,
        rp:user.rp
    }
    return new Response(JSON.stringify(res),{
        headers: {
            "content-type": "application/json"
        }
    });
}

export default liquidate