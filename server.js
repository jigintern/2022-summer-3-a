import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";

serve(async (req) => {
  const url = new URL(req.url)
  const pathname = url.pathname;
  console.log(pathname);
  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターンへようこそ！");
  }
  if(req.method === "GET" && pathname === "/user"){
    console.log(url.searchParams.get("uid"))
    //const res = getUser(url.searchParams.get("uid"))
    const res = {hello:"world"}
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "POST" && pathname === "/user"){
    const reqJson = await req.json()
    const res = updateUser(reqJson)
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "POST" && pathname === "/position"){
    const reqJson = await req.json()
    const res = postPosition(reqJson)
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "GET" && pathname === "/ranking"){
    const res = getUsers(url.searchParams.get("uid"),url.searchParams.get("key"))
    return new Response(JSON.stringify(res), {
      headers: {
          "content-type": "application/json"
      }
    });
  }else if(req.method === "GET" && pathname === "/liquidation"){
    const res = liquidate(url.searchParams.get("uid"))
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
