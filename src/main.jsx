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
window.UID_MAP = new Map()

window.ROOM_UID_MAP = new Map()
window.getConfig = () => {
    const content = localStorage.getItem("config")
    if (content === null || JSON.parse(content) === null) {
        const object =  {
            "Anonymous":false,
            "TopGiftNum":0,
            "TopGiftMinPrice":0,
            "Accounts": {

            }
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
    if (level <= 10) {
        return "#727BB5"
    }
    if (level <= 20) {
        return "#CF86B2"
    }
    if (level <= 30) {
        return "#5EC0F7"
    }
    if (level <= 40) {
        return "#6992FF"
    }
    if (level <= 50) {
        return "#AA78F1"
    }
    if (level <= 60) {
        return "#ED5674"
    }
    if (level <= 70) {
        return "#F58737"
    }
    if (level <= 80) {
        return "#F58837"
    }
    if (level <= 90) {
        return "#F58837"
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
