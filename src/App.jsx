import {
    Accordion,
    AccordionItem,
    Avatar,
    Badge,
    Button,
    Card,
    CardBody,
    Input,
    ResizablePanel,
    DropdownMenu,
    Tooltip, DropdownItem, SelectItem, Dropdown, AutocompleteItem
} from "@heroui/react";
import React, {useEffect, useState} from "react";
import LivePlayer from "./components/LivePlayer.jsx";
import ChatArea from "./components/ChatArea.jsx";
import GiftPanel from "./components/GiftPanel.jsx";
import WatcherTab from "./components/WatcherTab.jsx";
import GiftForm from "./components/GiftForm.jsx";
import LiverChip from "./components/LiverChip.jsx";
import SettingsForm from "./components/SettingsForm.jsx";
import {PanelGroup,Panel,PanelResizeHandle } from "react-resizable-panels"
import AccountForm from "./components/AccountForm.jsx";

function App() {

    const [livings, setLivings] = useState([]);

    const [current, setCurrent] = useState("");

    let [expanded, setExpanded] = useState(false);

    const [open, setOpen] = useState(false);

    const recExpand = false

    const [recList, setRecList] = useState([]);

    const [gift, setGift] = useState({});

    const [settings, setSettings] = useState(false);

    const [msg, setMsg] = useState("");

    const [showAcc,setShowAcc] = useState(false);




    const sendMessage = () => {
        if (msg === "") {
            return
        }
        window.parent.postMessage({
            'action': 'msg',
            "room":current,
            "text": msg,
        },"*")
        setMsg("")
    }

    useEffect(() => {

        window.parent.postMessage({action: "room-id"}, "*");

        window.parent.postMessage({action: "following-livings"}, "*");

        window.parent.postMessage({action: "recommend"}, "*");




        window.addEventListener("message", (event) => {

            if (event.data.action === "room-id") {
                window.ROOM_ID = event.data.data
                window.parent.postMessage({action: "room-info", room: ROOM_ID}, "*");

                if (current === "") {
                    setTimeout(() => {
                        setCurrent(ROOM_ID)
                    },100)
                }
            }

            if (event.data.action === "following-livings") {
                if (event.data.data.data.live_users) {
                    var items = event.data.data.data.live_users.items


                    setLivings(prev => [
                        ...prev,...items
                    ]);
                }
            }

            if (event.data.action === "room-info") {
                if (!isNaN(parseFloat(ROOM_ID))) {
                    var object = Object.values(event.data.data.data)[1]
                    object = Object.values(object)[0]
                    setLivings(prev => [
                        {
                            face: `https://workers.vrp.moe/bilibili/avatar/${object.uid}`,
                            mid: object.uid,
                            uname: object.uname,
                            room_id: object.room_id
                        },
                        ...prev
                    ]);
                }
            }

            if (event.data.action === "recommend") {
                var dst = []
                event.data.data.forEach(e => {
                    dst.push({
                        face:e.face,
                        mid: e.uid,
                        uname: e.uname,
                        room_id: e.roomid,
                        rec:true
                    })
                })
                setRecList(dst)
            }
        })
    }, []);


    useEffect(() => {
        console.log("current: ", current);
        //location.pathname = current
    },[current]);

    return (
        <div style={{height: "100vh", width: "100vw"}}>
            <div className={'flex flex-row w-full h-full'}>

                {showAcc && <AccountForm onClose={() => setShowAcc(false)} />}
                <PanelGroup direction={'horizontal'} autoSaveId="persistence">
                    <Panel>

                        {livings.filter(
                            (item, index, self) =>
                                index === self.findIndex((t) => t.mid === item.mid))
                            .map((item, i) => (
                                <div key={item.mid}>
                                    <LiverChip onClick={() => {
                                        setCurrent(item.room_id)
                                    }} selected={current === item.room_id} item={item}/>
                                </div>
                            ))}
                        <Accordion onSelectionChange={(e) => {
                            if (!expanded) {
                                window.parent.postMessage({action: "recommend"}, "*");
                            }
                            expanded = !expanded;
                        }}>
                            <AccordionItem key="1" aria-label="Accordion 1" title="推荐" className={''}>
                                <div className={'overflow-scroll scrollbar-hide'}>
                                    {recList.filter(
                                        (item, index, self) =>
                                            index === self.findIndex((t) => t.mid === item.mid))
                                        .map((item, i) => (
                                            <div key={item.mid}>
                                                <LiverChip onClick={() => {
                                                    setCurrent(item.room_id)
                                                    setRecList(recList.filter(v => v.room_id !== item.room_id))
                                                    setLivings(prev => [
                                                        ...prev.filter(e => !e.rec),item
                                                    ])
                                                }} selected={current === item.room_id} item={item}/>
                                            </div>
                                        ))}
                                </div>
                            </AccordionItem>
                        </Accordion>
                    </Panel>
                    <PanelResizeHandle />
                    <Panel>
                        {settings&&<SettingsForm onClose={() => {
                            setSettings(false);
                        }} />}
                        {open&&<GiftForm onClose={() => {
                            setOpen(false);
                        }} item={gift} room={current}/>}
                        <LivePlayer room={current} />
                        <Input label="Send Message..."  endContent={
                            <div className={'flex'}>
                                <Tooltip offset={30} content={
                                    <>
                                        <Dropdown>
                                            <DropdownMenu
                                                disallowEmptySelection
                                                aria-label="Multiple selection example"
                                                closeOnSelect={false}
                                                selectionMode="multiple"
                                                variant="flat"
                                                onSelectionChange={(e) => {
                                                    console.log(e)
                                                }}
                                            >
                                                <DropdownItem key="text">Text</DropdownItem>
                                                <DropdownItem key="number">Number</DropdownItem>
                                                <DropdownItem key="date">Date</DropdownItem>
                                                <DropdownItem key="single_date">Single Date</DropdownItem>
                                                <DropdownItem key="iteration">Iteration</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </>
                                } >
                                    <Button isIconOnly={true} size={'sm'}
                                            className={'mr-8'}
                                            onClick={(e) => {
                                                setShowAcc(true);
                                            }}
                                    >

                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
                                    </Button>
                                </Tooltip>
                                <Button isIconOnly={true} size={'sm'}
                                        className={'mr-8'}
                                        onClick={() => setSettings(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                                </Button>
                                <Tooltip content={<GiftPanel room={current} onOpen={(e) => {
                                    setOpen(true);
                                }} onClose={() => setOpen(false)} onSelect={(e) => {
                                    setGift(e)
                                }}/>}>

                                    <div  className={'flex'}>
                                        <Button isIconOnly={true} size={'sm'} className={'mr-8'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-80v-440H80v-240h208q-5-9-6.5-19t-1.5-21q0-50 35-85t85-35q23 0 43 8.5t37 23.5q17-16 37-24t43-8q50 0 85 35t35 85q0 11-2 20.5t-6 19.5h208v240h-80v440H160Zm400-760q-17 0-28.5 11.5T520-800q0 17 11.5 28.5T560-760q17 0 28.5-11.5T600-800q0-17-11.5-28.5T560-840Zm-200 40q0 17 11.5 28.5T400-760q17 0 28.5-11.5T440-800q0-17-11.5-28.5T400-840q-17 0-28.5 11.5T360-800ZM160-680v80h280v-80H160Zm280 520v-360H240v360h200Zm80 0h200v-360H520v360Zm280-440v-80H520v80h280Z"/></svg>

                                        </Button>

                                    </div>
                                </Tooltip>
                                <Button
                                    size="sm"
                                    color="primary"
                                    onPress={(e) => sendMessage()}
                                    className={''}
                                >
                                    发送
                                </Button>
                            </div>

                        } onChange={e => {
                            setMsg(e.target.value);
                        }} className={'mt-2'}/>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel>
                        <ChatArea room={current} expand={expanded}/>
                        <Accordion onSelectionChange={(e) => {
                            setExpanded(!expanded)
                        }
                        } style={expanded?{height:'30vh',maxHeight:'30vh'}:{height:'5vh'}} >
                            <AccordionItem key="1" aria-label="Accordion 1" title="在线   /   粉丝团   /   大航海" className={'h-full'}>
                                <WatcherTab room={current}/>
                            </AccordionItem>
                        </Accordion>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
}

export default App;
