import React, {useEffect} from 'react';
import {Card, CardBody, Tooltip} from "@heroui/react";
import GiftForm from "./GiftForm.jsx";

function formatName(str) {
    var s = ""
    var done = false;
    str.split('').forEach((item) => {
        if (!done) {
            if (item === '（' || item === '(') {
                done = true;
            } else {
                s += item;
            }
        }
    })

    return s
}

function GiftPanel(props) {
    var [list,setList] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        window.parent.postMessage({
            "action":"gift-list",
            "room":props.room
        },"*")

        window.addEventListener("message", (e) => {
            if (e.data.action === "gift-list") {
                setList(e.data.data.gift_config.base_config.list)
            }
        },{
            once:true
        })
        return () => {
            //props.onClose();
        }
    },[])
    return (
        <div style={{ maxHeight: '30vh', overflow: 'auto' ,maxWidth:'35vw'}}>

            <Card>
                <CardBody>
                    <div className="flex flex-row flex-wrap ">
                        {list &&
                            list
                                .sort((a, b) => a.price - b.price)
                                .map((e) => (
                                    <div key={e.id} style={{ width: '12.5%',marginRight:'10px',marginTop:'4px' }}  onClick={() => {
                                        props.onSelect(e)
                                        props.onOpen()
                                    }}>
                                        <Card className={'flex justify-center items-center'}>
                                            <img
                                                src={e.img_basic}
                                                style={{ width: '40px', height: '40px', maxWidth: '40px' }}
                                            />
                                            {formatName(e.name)}
                                        </Card>
                                    </div>
                                ))}
                    </div>
                </CardBody>
            </Card>
        </div>

    );
}

export default GiftPanel;