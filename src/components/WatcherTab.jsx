import React, {useEffect, useRef, useState} from 'react';
import {Card, CardBody, Tab, Tabs} from "@heroui/react";
import UserChip from "./UserChip.jsx";

function WatcherTab(props) {

    const [onlineCount,setOnlineCount] = useState(0)

    const [guardCount,setGuardCount] = useState(0)

    const [fansCount,setFansCount] = useState(0)

    const [onlineList,setOnlineList] = useState([])

    const [guardList,setGuardList] = useState([])

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
        if (e.data.action === "fans-club") {
            setFansCount(e.data.data.num)
        }
    }



    useEffect(() => {


        window.addEventListener("message", handleOnline)
        window.parent.postMessage({
            "action":"guard",
            "room":props.room
        },"*")
        window.parent.postMessage({
            "action":"fans-club",
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
                <Tab key="videos" title={`粉丝团：${fansCount}`}>
                    <Card>
                        <CardBody>
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                            mollit anim id est laborum.
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}

export default WatcherTab;