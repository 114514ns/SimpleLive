import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css"

import App from "./App.jsx";
import {HeroUIProvider} from "@heroui/system";

window.parent.postMessage({
    "action":"mid"
},"*")
window.toSpace = (id) => {
    window.open("https://space.bilibili.com/" + id)
}
window.getConfig = () => {
    const content = localStorage.getItem("config")
    if (!content) {
        const object =  {
            "Anonymous":false,
            "TopGiftNum":0,
            "TopGiftMinPrice":0,
        }

        localStorage.setItem("config",JSON.stringify(object));
        return object
    }
    return JSON.parse(content);
}

window.setConfig = (config) => {
    localStorage.setItem("config", JSON.stringify(config));
}
window.addEventListener("message", function (event) {
    if (event.data.action === "mid") {
        window.MID = event.data.data;
    }
},{
    once:true
})

window.getColor = (level) => {
    if (level <= 4) {
        return "#5762A799"
    }
    if (level <= 8) {
        return "#5866C799"
    }
    if (level <= 12) {
        return "#9BA9EC"
    }
    if (level <= 16) {
        return "#DA9AD8"
    }
    if (level <= 20) {
        return "#C79D24"
    }
    if (level <= 24) {
        return "#67C0E7"
    }
    if (level <= 28) {
        return "#6C91F2"
    }
    if (level <= 32) {
        return "#A97EE8"
    }
    if (level <= 36) {
        return "#C96B7E"
    }
    if (level <= 40) {
        return "#FF9D55"
    }


}

/*
const originalFetch = window.fetch;

window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    if (args[0].url.includes('index.m3u8')) {
        const clone = response.clone();

        const text = await clone.text();
        const u = new URL(this._url);

        let newResponse = "";
        var path = ""
        u.pathname.split("/").forEach((p,index) => {
            if (!p.includes("index.m3u8")) {
                path+=p + "/";
            }
        })
        text.split("\n").forEach(line => {
            if (line.includes("#") && !line.includes("EXT-X-MAP:URI")) {
                newResponse += line + "\r\n";
            } else if (line.trim() !== "" && !line.includes("EXT-X-MAP:URI")) {
                newResponse += "https://" +u.host +path+"/" +line  + u.search + "\r\n";
            } else {

            }
        });

        const res = new Response(newResponse, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });

        return res;

    }


    return response;
};


 */

ReactDOM.createRoot(document.getElementById("root")).render(
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
,
);
