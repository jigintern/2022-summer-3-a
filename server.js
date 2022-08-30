import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import getUser from "./getuser.js"
import postPosition from "./postposition.js"
import betUser from "./betuser.js"

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
    switch(res){
      case 0:
        return new Response(200,{status:200});
      case 1:
        return new Response("先に賭けの結果を清算してください",{
          status:400
        })
      case 2:
        return new Response("所持RPより大きな額は賭けれません",{
          status:400
        })
      case 3:
        return new Response("最後に走ってから1週間以上経過している人には賭けれません",{
          status:400
        })
      default:
        return 200
    }
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
