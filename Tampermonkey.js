// ==UserScript==
// @name         SimpleLive
// @namespace    http://tampermonkey.net/
// @version      2025-07-08
// @description  try to take over the world!
// @author       熊二
// @match           *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @connect     apibackup2.aicu.cc:88
// @connect     api.bilibili.com
// @connect     api.live.bilibili.com
// @connect     httpbin.org
// ==/UserScript==

(function () {
    'use strict';

    function sign(urls) {
        var wts = Math.round(new Date().getTime() / 1000)
        urls = urls + "&wts=" + wts
        var u = URL.parse(urls)
        var search = u.search;
        search = search.substring(1);
        var s = search.split("&").sort().join("&")
        var rid = SparkMD5.hash(s + "ea1db124af3c7062474693fa704f4ff8")

        return "https://" + u.host + u.pathname + "?" + s + "&w_rid=" + rid
    }
    var spilt = window.parent.location.pathname.split("/");
    var room = spilt[1];
    if (!location.search.includes("skip") && !isNaN(room) && room !== "") {
        var link = "https://localhost:5173"
        //link = "https://simple-live-omega.vercel.app/"
        document.open();
        document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="icon" href="https://bilibili.com/favicon.ico" />
            
        </head>
        <body style="margin:0px">
        <iframe src=${link} style="width:100vw;height:100vh" frameborder="no" allowfullscreen></iframe>
        </body>
        <style>::-webkit-scrollbar {display: none;}</style>
        </html>
    `);
        document.close();
    }

    window.addEventListener('DOMContentLoaded', () => {
        const iframe = document.querySelector('iframe');
        iframe.contentWindow.postMessage({action: 'parent-loaded'}, '*');
    });


    var api = null



    async function getRuid(room) {
        return (await api.get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomBaseInfo?req_biz=web_room_componet&room_ids=${room}`)).data.data.by_room_ids[room].uid;
    }

    document.cookie.split(";").forEach(cookie => {
        if (cookie.includes("bili_jct=")) {
            window.CSRF = cookie.replace("bili_jct=", "").replace(" ","")
        }
    })

    setTimeout(() => {
        api.post(
            'https://api.bilibili.com/x/web-interface/share/add?aid=114912370166303')
    },5000)



    window.addEventListener('message', async (event) => {
        if (api === null) {
            api = axios.create({
                baseURL: 'https://api.bilibili.com/',
                withCredentials: true
            });
        }
        const msg = event.data;
        if (msg.action === "following-livings") {
            api.get(`x/polymer/web-dynamic/v1/portal`, {
                withCredentials: true
            }).then((response) => {
                event.source.postMessage({
                    "action": "following-livings",
                    "data": response.data
                }, event.origin);
            })
        }
        if (msg.action === "room-info") {
            api.get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomBaseInfo?req_biz=web_room_componet&room_ids=` + msg.room).then((response) => {
                event.source.postMessage({
                    "action": "room-info",
                    "data": response.data
                }, event.origin)
            })
        }

        if (msg.action === "room-id") {
            var spilt = window.parent.location.pathname.split("/");
            var room = spilt[1];
            event.source.postMessage({
                "action": "room-id",
                "data": room
            }, event.origin)
        }

        if (msg.action === "stream") {

            api.get(sign(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?qn=25000&protocol=0,1&format=0,1,2&codec=0,1,2&web_location=444.8&room_id=${msg.room}`)).then((response) => {
                if (response.data.data) {
                    var d = response.data.data.playurl_info.playurl.stream
                    event.source.postMessage({
                        "action": "stream",
                        "data": d
                    }, event.origin)
                }

            })
        }

        if (msg.action === "websocket") {
            api.get( sign('https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?type=0&id=' + msg.room),{
                withCredentials: false
            }).then((response) => {
                event.source.postMessage({
                    "action": "websocket",
                    "data": response.data.data
                }, event.origin)
            })
            console.log("Post websocket message")
        }


        if (msg.action === "mid") {
            document.cookie.split(";").forEach(cookie => {
                if (cookie.indexOf("DedeUserID=") !== -1) {
                    event.source.postMessage({
                        "action": "mid",
                        "data": cookie.replace("DedeUserID=", "")
                    }, event.origin)
                }
            })

        }

        if (msg.action === "gift-list") {
            api.get(`https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/roomGiftList?room_id=${msg.room}&platform=pc`).then((response) => {
                event.source.postMessage({
                    "action": "gift-list",
                    "data": response.data.data
                }, event.origin)
            })
        }

        if (msg.action === "msg") {

            var csrf = window.CSRF
            if (msg.cookie !== '') {
                var split = msg.cookie.split(';')
                split.forEach(cookie => {
                    if (cookie.includes('bili_jct=')) {
                        csrf = cookie.replace("bili_jct=", "").trim()
                    }
                })
            }

            const formData = new URLSearchParams({
                "bubble": 0,
                "msg": msg.text,
                "color": 16777215,
                "mode": 1,
                "room_type": 0,
                "jump_from": 71001,
                "reply_mid": 0,
                "reply_attr": 0,
                "reply_dmid": 0,
                "statistics": '',
                "fontsize": 25,
                "rnd": Math.floor(new Date().getTime() / 1000),
                "roomid": msg.room,
                "csrf": csrf,
                "csrf_token": csrf
            }).toString();



            var opt = {
                method: "POST",
                url: sign('https://api.live.bilibili.com/msg/send?t=1'),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": msg.cookie,
                    "Origin": "https://live.bilibili.com",
                    "Referer": "https://live.bilibili.com/"
                },
                data: formData,
                onload: (res) => {
                    console.log("发送成功:", JSON.parse(res.responseText));
                    event.source.postMessage({
                        "action": "msg",
                        "data": JSON.parse(res.responseText)
                    }, event.origin);
                },
                onerror: (err) => {
                    console.error("发送失败:", err);
                }
            }
            if (msg.cookie !== '') {
                opt.cookie = msg.cookie
                opt.anonymous = true
            }
            GM_xmlhttpRequest(opt);
        }

        if (msg.action === "online") {
            var room = msg.room
            getRuid(room).then(value => {
                    api.get(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/queryContributionRank?ruid=${value}&room_id=${room}`).then((response) => {
                        event.source.postMessage({
                            "action": "online",
                            "data": response.data.data
                        }, event.origin)

                    })
                }
            )
        }

        if (msg.action === 'guard') {
            var room = msg.room
            getRuid(room).then(ruid => {
                    api.get(`https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topListNew?roomid=${room}&page=1&ruid=${ruid}&page_size=30&typ=5&platform=web`).then((response) => {
                        event.source.postMessage({
                            "action": "guard",
                            "data": response.data.data
                        }, event.origin)

                    })
                }
            )
        }

        if (msg.action === 'admins') {
            var room = msg.room
            api.get(`https://api.live.bilibili.com/xlive/web-room/v1/roomAdmin/get_by_room?roomid=${room}&page_size=30`).then((response) => {
                event.source.postMessage({
                    "action": "admins",
                    "data": response.data.data.data
                }, event.origin)

            })
        }

        if (msg.action === "recommend") {
            api.get('https://api.live.bilibili.com/xlive/web-interface/v1/index/getList?platform=web&web_location=444.7').then((response) => {
                event.source.postMessage({
                    "action": "recommend",
                    "data": response.data.data.room_list[1].list
                },event.origin)
            })
        }

        if (msg.action === "search") {
            api.get(`https://api.bilibili.com/x/web-interface//search/type?search_type=live&keyword=${msg.data}`).then((response) => {
                event.source.postMessage({
                    "action": "search",
                    "data": response.data.data.result.live_room
                },event.origin)
            })
        }
        if (msg.action === "history") {
            api.get(`https://api.live.bilibili.com/xlive/web-room/v1/dM/gethistory?roomid=${msg.room}`).then((response) => {
                event.source.postMessage({
                    "action": "history",
                    "data": response.data.data.admin.concat(response.data.data.room)
                },event.origin)
            })
        }

        if (msg.action === "medals") {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://apibackup2.aicu.cc:88/api/v3/user/getmedal?uid=" + msg.data,
                onload: function(response) {
                    event.source.postMessage({
                        "action": "medals",
                        data:JSON.parse(response.responseText)
                    },event.origin)
                }
            });
        }
        if (msg.action === "nav") {
            var opt = {
                method: "GET",
                url: "https://api.bilibili.com/x/web-interface/nav",
                headers: {

                },
                onload: (res) => {
                    console.log(res.responseText)
                    event.source.postMessage({
                        "action": "nav",
                        "data": JSON.parse(res.responseText)
                    },event.origin)
                }
            }
            if (msg.cookie !== '') {
                opt.cookie = msg.cookie
                opt.anonymous = true
            }
            GM_xmlhttpRequest(opt);
        }

        if (msg.action === "gift") {
            var csrf = window.CSRF
            if (msg.cookie !== '') {
                var split = msg.cookie.split(';')
                split.forEach(cookie => {
                    if (cookie.includes('bili_jct=')) {
                        csrf = cookie.replace("bili_jct=", "").trim()
                    }
                })
            }
            const formData = new URLSearchParams({
                "biz_id": msg.room,
                "csrf": csrf,
                "ruid":msg.ruid,
                "gift_num":msg.num,
                "gift_id":msg.gift_id,
                "coin_type":'gold',
                "bag_id":0,
                'platform':'pc',
                'biz_code':"Live",
                "price":msg.price,

            }).toString();

            var opt = {
                method: "POST",
                url: ('https://api.live.bilibili.com/xlive/revenue/v1/gift/sendGold?' + formData),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": msg.cookie,
                    "Origin": "https://live.bilibili.com",
                    "Referer": "https://live.bilibili.com/"
                },
                onload: (res) => {
                    console.log("发送成功:", JSON.parse(res.responseText));
                    event.source.postMessage({
                        "action": "msg",
                        "data": JSON.parse(res.responseText)
                    }, event.origin);
                },
                onerror: (err) => {
                    console.error("发送失败:", err);
                }
            }
            if (msg.cookie !== '') {
                opt.cookie = msg.cookie
                opt.anonymous = true
            }
            GM_xmlhttpRequest(opt);
        }

        if (msg.action === "battery") {
            var opt = {
                method: "GET",
                url: (
                    'https://api.live.bilibili.com/xlive/web-ucenter/user/get_user_info'),
                onload: (res) => {
                    event.source.postMessage({
                        "action": "battery",
                        "data": JSON.parse(res.responseText)
                    }, event.origin);
                },
                onerror: (err) => {
                    console.error("发送失败:", err);
                }
            }
            if (msg.cookie !== '') {
                opt.cookie = msg.cookie
                opt.anonymous = true
            }
            GM_xmlhttpRequest(opt);
        }


    });


})();