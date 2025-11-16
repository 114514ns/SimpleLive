import React, {useEffect, useRef, useState} from 'react';
import {addToast, Card, CardBody, CardFooter, Chip, Tooltip} from "@heroui/react";
import {AnimatePresence, motion} from "motion/react"
import HoverMedals from "./HoverMedals.jsx";




const brotli = await import("../brotli.js").then(m => m.default);

function parseMessage(message, emojiMap) {
    const regex = /\[([^\[\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
        const emojiKey = match[0]; // 包括中括号的键
        const matchIndex = match.index;

        if (matchIndex > lastIndex) {
            parts.push(message.slice(lastIndex, matchIndex));
        }

        if (emojiMap[emojiKey]) {
            parts.push(
                `<img src="${emojiMap[emojiKey]}" alt="${emojiKey}" style="width: 20px; height: 20px; vertical-align: text-bottom; display: inline-block;">`
            );
        } else {
            parts.push(emojiKey);
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < message.length) {
        parts.push(message.slice(lastIndex));
    }

    return parts.join('');
}

window.getGuardIcon = (level) => {
    var array = ["",
        "https://i1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/logo-1.b718085..png",
        "https://i1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/logo-2.d43d078..png",
        "https://i1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/logo-3.6d2f428..png"]
    return array[level]
}




function ChatArea(props) {

    window.ERROR  = false


    function buildMessage(body, type) {
        let buffer = new ArrayBuffer(16 + body.length);
        let view = new DataView(buffer)
        view.setUint32(0, body.length + 16)
        view.setUint16(4, 16)
        if (type !== 5) {
            view.setUint16(6, 1)
        } else {
            view.setUint16(6, 3)
        }
        view.setUint32(8, type)
        view.setUint32(12, 1)
        var array = new Uint8Array(buffer)
        const encoder = new TextEncoder();
        var encoded = encoder.encode(body)
        array.set(encoded, 16)

        return array;
    }


    var ws = useRef()
    var timer = useRef();

    const [eventList, setEventList] = useState([]);

    useEffect(() => {
        console.log("refresh ChatArea")



        window.parent.postMessage({
            "action": "websocket",
            "room": props.room,
            "anonymous":getConfig().Anonymous
        }, "*")


        function handleMessage(event) {
            if (event.data.action === "websocket") {
                //window.removeEventListener("message", handleMessage);

                ws.current = new WebSocket("wss://broadcastlv.chat.bilibili.com:2245/sub")

                ws.current.onopen = () => {
                    ws.current.send(buildMessage(JSON.stringify({
                        uid: getConfig().Anonymous?0:parseInt(window.MID),
                        roomid: parseInt(props.room),
                        key: event.data.data.token,
                        type: 2,
                        platform: "web",
                        protover: 3,
                    }), 7));

                    timer.current = setInterval(() => {
                        try {
                            ws.current.send(buildMessage('IKUN', 2))
                        } catch (e) {
                            if (window.ERROR === false) {
                                window.ERROR = true;
                                addToast({
                                    title: "Toast title",
                                    description: "Toast displayed successfully",
                                    color: 'danger',
                                })
                            }
                        }

                    }, 1000 * 15);
                };

                ws.current.onclose = (e) => {
                    //console.log("onClose",e)
                }
                ws.current.onmessage = event => {
                    event.data.arrayBuffer().then(buffer => {
                        var view = new DataView(buffer);
                        if (view.getUint16(6) == 3) {
                            var compressed = new Uint8Array(buffer);
                            compressed = compressed.slice(16, buffer.byteLength);
                            const decompressed = brotli.decompress(compressed);
                            view = new DataView(decompressed.buffer);
                            var size = decompressed.byteLength;
                            var pos = 0
                            while (size - pos > 16) {
                                var nextSize = view.getUint32(pos) - 16
                                const text = new TextDecoder().decode(decompressed.slice(pos + 16, pos + 16 + nextSize));
                                var obj = JSON.parse(text);
                                if (obj.cmd === "COMBO_SEND") {
                                    console.log(obj);
                                }
                                if (obj.cmd === "COMBO_SEND AND 0" || obj.cmd === "SEND_GIFT" || obj.cmd === "DANMU_MSG" || obj.cmd === 'GUARD_BUY' || obj.cmd === 'SUPER_CHAT_MESSAGE') {
                                    //console.log(obj)
                                    const event = {
                                        UUID: crypto.randomUUID()
                                    }
                                    if (obj.cmd === "DANMU_MSG") {

                                        event.ActionName = "msg"
                                        event.Time = new Date(obj.info[9].ts * 1000)
                                        event.Message = obj.info[1]
                                        event.MedalName = obj.info[3][1]
                                        event.MedalLevel = obj.info[3][0]
                                        event.Face = obj.info[0][15].user.base.face
                                        if (obj.info[0][15].user.medal) {
                                            event.MedalLiver = obj.info[0][15].user.medal.ruid
                                            event.MedalColor = obj.info[0][15].user.medal.v2_medal_color_start
                                            event.GuardLevel = obj.info[0][15].user.medal.guard_level
                                        }
                                        event.Emoji = {}
                                        var extra = JSON.parse(obj.info[0][15].extra)
                                        if (extra.emots) {
                                            event.Emoji = extra.emots
                                            event.Emoji[Object.keys(event.Emoji)] = event.Emoji[Object.keys(event.Emoji)].url
                                        }
                                        if (obj.info[0][13].emoticon_unique) {
                                            event.Emoji[obj.info[0][13].emoticon_unique.replace("upower_", "")] = obj.info[0][13].url
                                        }

                                        event.FromName = obj.info[2][1]
                                        event.FromId = obj.info[2][0]

                                        //console.log(obj)
                                        //console.log(event)
                                    }


                                    if (obj.cmd === "COMBO_SEND" || obj.cmd === "SEND_GIFT") {
                                        event.Time = new Date()
                                        event.FromName = obj.data.uname
                                        event.FromId = obj.data.uid
                                        if (obj.data.giftName) {
                                            event.GiftName = obj.data.giftName
                                        }
                                        if (obj.data.gift_name) {
                                            event.GiftName = obj.data.gift_name
                                        }

                                        event.ToName = obj.data.receive_user_info.uname
                                        event.ToId = obj.data.receive_user_info.uid
                                        event.GiftPicture = obj.data.gift_info.webp
                                        event.GiftPrice = obj.data.total_coin / 1000
                                        if (obj.data.timestamp) {
                                            event.Time = new Date(obj.data.timestamp * 1000)
                                        }
                                        if (obj.data.combo_num) {
                                            event.GiftAmount = obj.data.total_num
                                        }
                                        if (obj.data.combo_send) {
                                            event.GiftAmount = obj.data.combo_send.gift_num
                                        }
                                        if (obj.data.blind_gift) {
                                            event.GiftPrice = obj.data.blind_gift.gift_tip_price / 1000
                                            event.BoxName = obj.data.blind_gift.original_gift_name
                                            event.BoxPrice = obj.data.blind_gift.original_gift_price
                                        }
                                        if (obj.data.sender_uinfo.medal) {
                                            event.MedalName = obj.data.sender_uinfo.medal.name
                                            event.MedalLevel = obj.data.sender_uinfo.medal.level
                                            event.MedalColor = obj.data.sender_uinfo.medal.v2_medal_color_start
                                            //event.MedalName = obj.data.sender_uinfo.medal.name
                                        }
                                        if (obj.data.combo_total_coin) {
                                            event.GiftPrice = obj.data.combo_total_coin / 1000
                                        }
                                        if (obj.data.face) {
                                            event.Face = obj.data.face
                                        }
                                        if (obj.data.sender_uinfo) {
                                            event.Face = obj.data.sender_uinfo.base.face
                                        }

                                        //console.log(obj)
                                        //console.log(event)
                                    }

                                    if (obj.cmd === "SUPER_CHAT_MESSAGE") {
                                        console.log(obj)
                                        setEventList(prev => [event,
                                            ...prev
                                        ]);
                                        event.ActionName = 'sc'
                                        event.Time = new Date(obj.data.start_time * 1000)
                                        event.EndTime = new Date(obj.data.end_time * 1000)
                                        event.FromId = obj.data.uid
                                        event.Message = obj.data.message
                                        event.GiftPrice = obj.data.price
                                        if (obj.data.uinfo.medal) {
                                            event.MedalName = obj.data.uinfo.medal.name
                                            event.MedalLevel = obj.data.uinfo.medal.level
                                            event.MedalColor = getColor(event.MedalLevel)
                                        }
                                        event.GuardLevel = obj.data.medal_info.guard_level
                                        event.FromName = obj.data.user_info.uname
                                        event.Face = `https://workers.vrp.moe/bilibili/avatar/${event.UID}`
                                        event.Emoji = {}
                                    }

                                    if (obj.cmd === "GUARD_BUY") {
                                        event.ActionName = 'guard'
                                        event.GiftName = obj.data.gift_name
                                        event.GiftPrice = obj.data.price / 1000
                                        event.GiftAmount = obj.data.num
                                        event.FromName = obj.data.username
                                        event.FromId = obj.data.uid
                                        event.Face = `https://workers.vrp.moe/bilibili/avatar/${event.UID}`
                                        event.Time = new Date()


                                    }
                                    console.log(obj)
                                    if (event.FromId === 0) {

                                    }
                                    setEventList(prev => {
                                        const now = new Date()

                                        var list = [event, ...prev]
                                        list = Array.from(
                                            new Map(list.map(item => [item.UUID, item])).values()
                                        );
                                        const prioritized = list.filter(e => e.ActionName === 'sc' && new Date(e.EndTime) > now)
                                        const rest = list.filter(e => !(e.ActionName === 'sc' && new Date(e.EndTime) > now))

                                        var DEPTH = Math.min(rest.length,30)
                                        for(var i = 0; i < DEPTH; i++) {
                                            if (rest[i].FromId === 0) {
                                                var o2 = UID_MAP.get(rest[i].Face)
                                                if (o2 !== undefined) {
                                                    rest[i].FromId = o2.UID
                                                    rest[i].FromName = o2.UName
                                                }
                                            }
                                        }

                                        return [...prioritized, ...rest]
                                    })

                                }
                                pos = pos + view.getUint32(pos)
                            }
                        }

                    })
                };
            }
            if (event.data.action === "history") {
                var array = event.data.data
                var DEPTH = Math.min(30,eventList.length)
                const cpy = [...eventList];
                array.forEach(e => {
                    window.UID_MAP.set(e.user.base.face,{
                        UID:e.uid,
                        UName: e.user.base.name
                    })
                })
                setEventList(prev => {
                    var list = [...prev]

                    var DEPTH = Math.min(list.length,30)
                    for(var i = 0; i < DEPTH; i++) {
                        if (list[i].FromId === 0) {
                            var o2 = UID_MAP.get(list[i].Face)
                            if (o2 !== undefined) {
                                list[i].FromId = o2.UID
                                list[i].FromName = o2.UName
                            }
                        }
                    }

                    return [ ...list]
                })
            }
        }

        window.addEventListener("message", handleMessage);
        var history = setInterval(() => {
            if (props.room) {
                window.parent.postMessage({
                    "action": "history",
                    "room": props.room,
                }, "*")
            }

        },500)
        return () => {
            if (ws.current) {
                //ws.current.close()

                //ws.current = undefined
            }
            if (timer.current) {
                clearInterval(timer.current);
                clearInterval(history)
            }
            window.removeEventListener("message", handleMessage);
            //setEventList([])
        };
    }, [props.room]);
    return (
        <div className={'items-center overflow-y-scroll ml-8 overflow-x-hidden flex flex-col'}
             style={props.expand ? {height: '70vh'} : {height: '95vh'}}>
            <AnimatePresence initial={false}>
                {eventList.slice(0, 200).map(e => (
                    <motion.div
                        className={'w-[100%]'}
                        key={e.UUID}
                        initial={{opacity: 0, y: 0}}
                        animate={{opacity: 1, y: 40}}
                        transition={{duration: 0.5}}
                    >
                        <ChatItem item={e}/>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

    );
}

function ChatItem(props) {

    const item = props.item;
    const [style, setStyle] = useState("");
    useEffect(() => {
        if (item.ActionName === 'sc') {
            const interval = setInterval(() => {
                const start = item.Time.getTime()
                const now = new Date().getTime();
                const end = item.EndTime
                const duration = end - start;

                let percent = (now - start) / duration * 100
                if (percent > 100 || percent < 0) {
                    clearInterval(interval);
                }
                var leftColor = ' rgba(105,205,255,0.2)'
                var rightColor = '#ffffff'
                setStyle(`linear-gradient(to right,
                ${leftColor} 0%,
                ${leftColor} ${percent}%,
                ${rightColor} ${percent}%,
                ${rightColor} 100%)`);
            }, 25)

            return () => {
                clearInterval(interval);
            }
        }
    }, []);
    return (
        <Card style={{width:'100%', marginTop: "10px", background: style}}
              isHoverable
              key={`${item.UUID}`}

        >
            <CardBody>
                <div style={{display: "flex"}}>
                    <img
                        src={item.Face}
                        style={{width: '40px', height: '40px', borderRadius: '50%'}}
                        onClick={() => toSpace(item.FromId)}
                    />
                    <div className={'ml-2 w-full'}>
                        <div className={'w-full'}>
                            <div className={'flex justify-between w-full'}>
                                <p className={'font-bold'}>{item.FromName}</p>
                                {item.ActionName === 'sc' && (<p className={'font-bold'}>￥{item.GiftPrice}</p>)}
                            </div>

                            {item.MedalName && (
                                <Tooltip content={<HoverMedals id={item.FromId}/>}>
                                    <Chip
                                        className={'hover:scale-105 transition-transform '}
                                        startContent={item.GuardLevel ? <img src={getGuardIcon(item.GuardLevel)} style={{
                                            width: '20px',
                                            height: '20px'
                                        }}></img> : <CheckIcon size={18}/>}
                                        variant="faded"
                                        style={{background: item.MedalColor, color: 'white'}}
                                        onClick={() => {
                                            item.MedalLiver && toSpace(item.MedalLiver)
                                        }}
                                    >
                                        {item.MedalName}
                                        <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full">
                                                            {item.MedalLevel}
                                                        </span>
                                    </Chip>
                                </Tooltip>
                            )}
                        </div>
                        <div style={{marginLeft: "8px"}}>
                            {item.ActionName === "msg" || item.ActionName === 'sc' ? (
                                Object.keys(item.Emoji).length != 0 ? <div>
                                    <Tooltip content={Object.keys(item.Emoji)[0]}>
                                                                    <span
                                                                        className="messageText "
                                                                        dangerouslySetInnerHTML={{__html: parseMessage(item.Message, item.Emoji)}}
                                                                    ></span>
                                    </Tooltip>
                                </div> : <div>
                                                <span
                                                    className="messageText "
                                                    dangerouslySetInnerHTML={{__html: parseMessage(item.Message, item.Emoji)}}
                                                ></span>
                                </div>
                            ) : (
                                <GiftPart name={item.GiftName} img={item.GiftPicture} price={item.GiftPrice}
                                          amount={item.GiftAmount}/>
                            )}
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter>
                <p className={' right-3'}>
                    {String(item.Time.getHours()).padStart(2, '0')}:
                    {String(item.Time.getMinutes()).padStart(2, '0')}
                </p>
            </CardFooter>
        </Card>
    )
}

function GiftPart(props) {
    return (
        <div>
            <Tooltip content={props.name}>
                <img src={props.img} alt="" style={{objectFit: "cover", width: "60px"}}/>
            </Tooltip>
            <span className={'font-bold'}>{props.name} </span>* {props.amount} CNY {props.price}
        </div>
    );
}

const CheckIcon = React.memo(({size = 24, color = "currentColor", ...props}) => {
    return (
        <svg width={size} height={size} {...props}>
            <use href="#icon-check" fill={color}/>
        </svg>
    );
})

export default ChatArea;