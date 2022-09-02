import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import getUser from "./getuser.js"
import postPosition from "./postposition.js"
import betUser from "./betuser.js"
import liquidate from "./liquidate.js"
import postUser from "./postuser.js"
import getUsers from "./getranking.js"
import exists from "./exists.js"

serve(async (req) => {
    const url = new URL(req.url)
    const pathname = url.pathname;
    console.log(pathname);
    if (req.method === "GET" && pathname === "/welcome-message") {
        return new Response("jigインターンへようこそ！");
    }
    
    if(req.method === "GET" && pathname === "/user"){
        const res = await getUser(url.searchParams.get("uid"),url.searchParams.get("targetuid"))
        return res
    }else if(req.method === "POST" && pathname === "/user"){
        const reqJson = await req.json()
        const res = await postUser(reqJson)
        return res
    }else if(req.method === "POST" && pathname === "/position"){
        const reqJson = await req.json()
        const res = await postPosition(reqJson)
        return res
    }else if(req.method === "GET" && pathname === "/users"){
        const res = await getUsers(url.searchParams.get("uid"),url.searchParams.get("key"),url.searchParams.get("level"))

        return res
    }else if(req.method === "GET" && pathname === "/liquidation"){
        const res = await liquidate(url.searchParams.get("uid"))
        return res
    }else if(req.method === "POST" && pathname === "/bet"){
        const reqJson = await req.json()
        const res = await betUser(reqJson)
        return res
    }else if(req.method === "GET" && pathname === "/exists"){
        const res = await exists(url.searchParams.get(uid))
        return res;
    }

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});
