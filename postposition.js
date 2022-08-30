import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
getDoc,
setDoc,
doc,Timestamp
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore-lite.js";
import db from "./firebase.js";

const postPosition  = async(req) => {

    let distance;
    let uid = await req.uid;
    let lat = await req.position.lat * Math.PI/180; //緯度
    let lng = await req.position.lng * Math.PI/180; //経度
    let status = await req.status;
    let plat; //一つ前の緯度
    let plng; //一つ前の経度
    let positions; //
    let starttime;
    const distancesRef = doc(db,"distances",uid);
    if(status != "start")
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
            console.log("p",positions);
    }
    else if(status === "start")
    {
        distance = 0;
        positions = [{"lat":lat * 180/ Math.PI,"lng":lat * 180/ Math.PI}];
        var now = Timestamp.now().toDate();
        now.setHours(now.getHours());
        const year = now.getFullYear();
        const month = now.getMonth() ;
        const date = now.getDate();
        const hour = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();
        const shapedNow = new Date(year,month,date,hour,min,sec);
        starttime = Timestamp.fromDate(shapedNow);
        console.log(starttime.toDate());
    }
    if(status == "finish")
    {
        const usersRef = doc(db,"users",uid);
        var data;
        var st = starttime.toDate();
        var year = st.getFullYear();
        var month = st.getMonth() + 1 ;
        var date = st.getDate() ;
        var hour = st.getHours();
        var min = st.getMinutes();
        var sec = st.getSeconds();
        month = ("0" + month).slice(-2);
        date = ("0" + date).slice(-2);
        

        const datekey = year + "-" + month + "-" + date;
        var pdist;
        var ptime;
        await getDoc(usersRef).then(doc => {
            data = doc.data();
            
        });
        if(data.runninglog[datekey] != null)
        {
            data.runninglog[datekey].distance += distance;
            data.runninglog[datekey].time += await req.time;
        }
        else
        {
            
            data.runninglog[datekey]={
                "distance" : distance,
                "time" : await req.time
            }
            console.log(data.runninglog[datekey]);
        }
        data.runninglog[datekey].distance
        data.lastrun = starttime;
        await setDoc(doc(db,"users",uid),data);
    }
    
    
    var data = {
        distance:distance,
        positions:positions,
        starttime:starttime
    }
    await setDoc(doc(db,"distances","testuid"),data);
    return {
        "positions":positions,
        "distance":distance
    }
}

export default postPosition