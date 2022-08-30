import {
getDoc,
setDoc,
doc,Timestamp
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
import db from "./firebase.js";

const postPosition  = async(req) => {

    let distance;
    let uid = req.uid;
    let lat = req.position.lat * Math.PI/180; //緯度
    let lng = req.position.lng * Math.PI/180; //経度
    let status = req.status;
    let plat; //一つ前の緯度
    let plng; //一つ前の経度
    let positions; //
    let starttime;
    const distancesRef = doc(db,"distances",uid);
    if(status !== "start")
    {
        await getDoc(distancesRef).then(doc => {
            distance = doc.data()["distance"];
            positions = doc.data()["positions"];
            starttime = doc.data()["starttime"];
            const pposition = positions[positions.length-1];
            plat = pposition.lat * Math.PI/180;
            plng = pposition.lng * Math.PI/180;
            distance = doc.data()["distance"];
        });
        var movedDistance = 
            6371 * 1000 *
            Math.acos(Math.cos(lat) * Math.cos(plat) * Math.cos(plng - lng) + Math.sin(lat) * Math.sin(plat));
            distance += movedDistance;
            positions.push( {"lat":lat * 180/ Math.PI,"lng":lat * 180/ Math.PI});
    }
    else
    {
        distance = 0;
        positions = [{"lat":lat * 180/ Math.PI,"lng":lat * 180/ Math.PI}];
        starttime = Timestamp.now().toDate();
        
    }

    if(status == "finish")
    {
        const usersRef = doc(db,"users",uid);
        var data;
        var st = starttime.toDate();
        var year = st.getFullYear();
        var month = st.getMonth() + 1 ;
        var date = st.getDate() ;
        month = ("0" + month).slice(-2);
        date = ("0" + date).slice(-2);
        
        const datekey = year + "-" + month + "-" + date;
        await getDoc(usersRef).then(doc => {
            data = doc.data();
        });
        if(data.runninglog[datekey] != null)
        {
            data.runninglog[datekey].distance += distance;
            data.runninglog[datekey].time += req.time;
        }
        else
        {
            data.runninglog[datekey]={
                "distance" : distance,
                "time" : req.time
            }
        }
        data.lastrun = starttime;
        await setDoc(doc(db,"users",uid),data);
    }
    
    var data = {
        distance:distance,
        positions:positions,
        starttime:starttime
    }
    await setDoc(doc(db,"distances",uid),data);
    return new Response(JSON.stringify({
            "positions":positions,
            "distance":distance
        }), 
        {
        headers: {
            "content-type": "application/json"
        }
    });
}

export default postPosition