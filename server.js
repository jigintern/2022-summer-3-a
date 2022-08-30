import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import getUser from "./getuser.js"
import postPosition from "./postposition.js"
serve(async (req) => {
  const url = new URL(req.url)
  const pathname = url.pathname;
  console.log(pathname);
  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターンへようこそ！");
  }
  if(req.method === "GET" && pathname === "/user"){
    console.log(url.searchParams.get("uid"))
    const res = await getUser(url.searchParams.get("uid"))
    //const res = {hello:"world"}
    console.log(res)
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "POST" && pathname === "/user"){
    const reqJson = await req.json()
    const res = await updateUser(reqJson)
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "POST" && pathname === "/position"){
    const reqJson = await req.json()
    const res = await postPosition(reqJson)
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "GET" && pathname === "/ranking"){
    const res = await getUsers(url.searchParams.get("uid"),url.searchParams.get("key"))
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "GET" && pathname === "/liquidation"){
    const res = await liquidate(url.searchParams.get("uid"))
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "POST" && pathname === "/bet"){
    const reqJson = await req.json()
    const res = await betUser(reqJson)
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
