import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
//import ip from "https://esm.sh/ip@1.1.8"
import db from "./firebase.js"

const getUsers  = async (uid,key,level) => {
    const userDocs = await getDocs(collection(db, "users"))
    const users = []
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    var own = {}
    if(key === "distbyweek"){
        today.setDate(today.getDate() - 7)
    }else if(key === "distbymonth"){
        today.setDate(today.getDate() - 30)
    }else{
        today.setFullYear(0)
    }
    userDocs.forEach((doc) => {
        if(level === "1"){
            if(doc.data().level === 1){
                var distance = 0
                if(Object.keys(doc.data().runninglog).length){
                    distance = Object.keys(doc.data().runninglog).reduce((sum,okey) => {
                        if(today.getTime() < new Date(okey).getTime()){
                            return sum + doc.data().runninglog[okey].distance
                        }else{
                            return sum
                        }
                    },0)
                    if(key === "avg"){
                        distance /= Object.keys(doc.data().runninglog).length
                    }
                }
                users.push({
                    uid:doc.id,
                    name:doc.data().name,
                    level:doc.data().level,
                    continuation:doc.data().continuation,
                    maxcontinuation:doc.data().maxcontinuation,
                    distance:distance,
                })
            }
        }
        else if(level === "2"){
            if(doc.data().level === 2){
                var distance = 0
                if(Object.keys(doc.data().runninglog).length){
                    distance = Object.keys(doc.data().runninglog).reduce((sum,okey) => {
                        if(today.getTime() < new Date(okey).getTime()){
                            return sum + doc.data().runninglog[okey].distance
                        }else{
                            return sum
                        }
                    },0)
                    if(key === "avg"){
                        distance /= Object.keys(doc.data().runninglog).length
                    }
                }
                users.push({
                    uid:doc.id,
                    name:doc.data().name,
                    level:doc.data().level,
                    continuation:doc.data().continuation,
                    maxcontinuation:doc.data().maxcontinuation,
                    distance:distance,
                })
            }
        }
        else if(level === "3"){
            var distance = 0
            if(Object.keys(doc.data().runninglog).length){
                distance = Object.keys(doc.data().runninglog).reduce((sum,okey) => {
                    if(today.getTime() < new Date(okey).getTime()){
                        return sum + doc.data().runninglog[okey].distance
                    }else{
                        return sum
                    }
                },0)
                if(key === "avg"){
                    distance /= Object.keys(doc.data().runninglog).length
                }
            }
            if(doc.data().level === 3){
                users.push({
                    uid:doc.id,
                    name:doc.data().name,
                    level:doc.data().level,
                    continuation:doc.data().continuation,
                    maxcontinuation:doc.data().maxcontinuation,
                    distance:distance,
                })
            }
        }
        else{
            var distance = 0
            if(Object.keys(doc.data().runninglog).length){
                distance = Object.keys(doc.data().runninglog).reduce((sum,okey) => {
                    if(today.getTime() < new Date(okey).getTime()){
                        return sum + doc.data().runninglog[okey].distance
                    }else{
                        return sum
                    }
                },0)
                if(key === "avg"){
                    distance /= Object.keys(doc.data().runninglog).length
                }
            }
            users.push({
                uid:doc.id,
                name:doc.data().name,
                level:doc.data().level,
                continuation:doc.data().continuation,
                maxcontinuation:doc.data().maxcontinuation,
                distance:distance,
            })
        }
        if(doc.id === uid){
            own = {
                uid:doc.id,
                name:doc.data().name,
                level:doc.data().level,
                continuation:doc.data().continuation,
                maxcontinuation:doc.data().maxcontinuation,
                distance:distance,
                rank:0
            }
        }
    })
    if(key === "distance" || key === "distbyweek" || key === "distbymonth" || key === "avg"){
        users.sort((a,b) => {
            return a.distance - b.distance
        })
    }else if(key === "continuation"){
        users.sort((a,b) => {
            return a.continuation - b.continuation
        })
    }else if(key === "maxcontinuation"){
        users.sort((a,b) => {
            return a.maxcontinuation - b.maxcontinuation
        })
    }else{
        return new Response("keyが不正です",{
            status:400
        })
    }
    users.reverse()
    if(!Object.keys(own).length){
        return new Response("このuidは登録されていませんです",{
            status:400
        })
    }
    users.some((user,i) => {
        if(user.uid === uid){
            own.rank = i+1
            return 1
        }
    })
    const res = {
        rankers:users,
        ownranks:own
    }
    return new Response(JSON.stringify(res),{
        headers:{
            "content-type": "application/json"
        }
    })
}

export default getUsers