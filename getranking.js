import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const getUsers  = async (uid,key,level) => {
    const userDocs = await getDocs(collection(db, "users"))
    const users = []
    //console.log(level)
    userDocs.forEach((doc) => {
        if(level === "1"){
            if(doc.data().level === 1){
                //console.log(doc.data().runninglog)
                const distance = 0
                if(Object.keys(doc.data().runninglog).length){
                    distance = Object.keys(doc.data().runninglog).reduce((sum,key) => {
                        //console.log(key)
                        //console.log(doc.data().runninglog.key.distance)
                        return sum + doc.data().runninglog.key.distance
                    })
                }
                console.log("\n")
                console.log(distance)
                console.log("\n")
                users.push({
                    uid:doc.id,
                    name:doc.data().name,
                    level:doc.data().level,
                    continuation:doc.data().continuation,
                    distance:distance,
                })
            }
        }
        else if(level === "2"){
            if(doc.data().level === 0){
                users.push({
                    uid:doc.id,
                    name:doc.data().name,
                    level:doc.data().level,
                    continuation:doc.data().continuation,
                    distance:doc.data().distance,
                })
            }
        }
        else if(level === "3"){
            if(doc.data().level === 0){
                users.push({
                    uid:doc.id,
                    name:doc.data().name,
                    level:doc.data().level,
                    continuation:doc.data().continuation,
                    distance:doc.data().distance,
                })
            }
        }
        else{
            //console.log(typeof level)
            //console.log(level === 1)
            users.push({
                uid:doc.id,
                name:doc.data().name,
                level:doc.data().level,
                continuation:doc.data().continuation,
                distance:doc.data().distance,
            })
        }
    })
    /*return new Response(JSON.stringify(data), 
        {
        headers: {
            "content-type": "application/json"
        },

    });*/
}

export default getUsers