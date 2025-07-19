import React, {useEffect, useState} from 'react';
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Slider} from "@heroui/react";

function GiftForm(props) {

    const [amount, setAmount] = useState(1);

    const [liver,setLiver] = useState('');

    useEffect(() => {

        window.parent.postMessage({action: "room-info", room: props.room}, "*");
        window.addEventListener("message", function (event) {
            if (event.data.action === "room-info") {
                if (!isNaN(parseFloat(ROOM_ID))) {
                    const object = event.data.data.data.by_room_ids[window.ROOM_ID]
                    setLiver(object.uname,)
                }
            }
        },{
            once:true
        })
        console.log(props)
    },[])
    return (
        <div>
            <Modal isOpen={true}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">赠送给 {liver} {props.item.name}*{amount},  {props.item.price*amount/1000}元</ModalHeader>
                        <ModalBody>
                            <img src={props.item.gif}></img>
                            <Slider
                                className="max-w-md"
                                defaultValue={1}
                                label="数量"
                                maxValue={100}
                                minValue={1}
                                step={1}
                                onChange={(e) => {
                                    setAmount(e)
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={props.onClose}>
                                关闭
                            </Button>
                            <Button color="primary" onPress={props.onClose}>
                                确认
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default GiftForm;