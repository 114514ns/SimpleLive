import React, {useEffect, useRef, useState} from 'react';
import {Card, CardBody, Tab, Tabs, Tooltip} from "@heroui/react";
import UserChip from "./UserChip.jsx";
import HoverMedals from "./HoverMedals.jsx";

function WatcherTab(props) {

    const [onlineCount,setOnlineCount] = useState(0)

    const [guardCount,setGuardCount] = useState(0)


    const [onlineList,setOnlineList] = useState([])

    const [guardList,setGuardList] = useState([])

    const [admins,setAdmins] = useState([])

    const timer = useRef()

    const handleOnline = e => {
        const dst = []
        if (e.data.action === "online") {
            setOnlineCount(e.data.data.count)

            e.data.data.item?.forEach(item => {
                dst.push({
                    UName: item.name,
                    UID:item.uinfo.uid,
                    Face:item.uinfo.base.face,
                    MedalName:item.uinfo.medal?.name,
                    MedalLevel:item.uinfo.medal?.level,
                    GuardLevel:item.guard_level,
                    MedalColor:item.uinfo.medal?.v2_medal_color_start
                })
            })
            setOnlineList(dst)
        }
        if (e.data.action === "guard") {
            setGuardCount(e.data.data.info.num)
            e.data.data.top3.concat(e.data.data.list).forEach(item => {
                dst.push({
                    UName: item.uinfo.base.name,
                    UID:item.uinfo.uid,
                    Face:item.uinfo.base.face,
                    MedalName:item.uinfo.medal?.name,
                    MedalLevel:item.uinfo.medal?.level,
                    GuardLevel:item.uinfo.guard.level,
                    MedalColor:item.uinfo.medal?.v2_medal_color_start
                })
            })
            setGuardList(dst)
        }
        if (e.data.action === "admins") {
            setAdmins(e.data.data)
        }
    }



    useEffect(() => {


        window.addEventListener("message", handleOnline)
        window.parent.postMessage({
            "action":"guard",
            "room":props.room
        },"*")
        window.parent.postMessage({
            "action":"admins",
            "room":props.room
        },"*")
        window.parent.postMessage({
            "action":"online",
            "room":props.room
        },"*")
        timer.current = setInterval(() => {
            window.parent.postMessage({
                "action":"online",
                "room":props.room
            },"*")


            if (Math.random()%10 === 2) {
                window.parent.postMessage({
                    "action":"guard",
                    "room":props.room
                },"*")
                window.parent.postMessage({
                    "action":"fans-club",
                    "room":props.room
                },"*")
            }



        },3000)

        return () => {
            window.removeEventListener('message',handleOnline)
            clearInterval(timer.current)
        }
    }, [props.room]);
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options" fullWidth={true}>
                <Tab key="photos" title={`在线：${onlineCount}`}>
                    <div className={'h-full overflow-y-scroll overflow-x-hidden'} style={{height:'20vh'}}>
                        {onlineList.sort((a, b) => {
                            return b.MedalLevel - a.MedalLevel
                        }).map((item, i) => {
                            return (
                                <UserChip item={item} key={i} />

                            )
                        })}
                    </div>
                </Tab>
                <Tab key="music" title={`大航海：${guardCount}`}>
                    <div className={'h-full overflow-y-scroll overflow-x-hidden'} style={{height:'20vh'}}>
                        {guardList.sort((a, b) => {
                            return b.MedalLevel - a.MedalLevel
                        }).map((item, i) => {
                            return (
                                <UserChip item={item} key={i} />
                            )
                        })}
                    </div>
                </Tab>
                <Tab key="videos" title={`房管：${admins.length??0}`}>
                    <div className={'h-full overflow-y-scroll overflow-x-hidden'} style={{height:'20vh'}}>
                        {admins.map((item, i) => {
                            item.UID = item.uid
                            item.Face = item.face
                            item.UName = item.uname
                            return (
                                <UserChip item={item} key={i} />
                            )
                        })}
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}

export default WatcherTab;