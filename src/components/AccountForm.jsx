import React, {useEffect} from 'react';
import {
    Autocomplete, AutocompleteItem,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Switch,
    Form, Avatar
} from "@heroui/react";



function AccountForm(props) {
    const [cookie, setCookie] = React.useState("");


    function handleMessage(e) {
        if (e.data.action === "nav") {
            var mid = e.data.data.data.mid
            if (mid) {
                setUname( e.data.data.data.uname)
                setUid(mid)
                var config = getConfig()
                if (!config.Accounts) {
                    config.Accounts = {}

                }
                config.Accounts[mid] = {
                    Cookie:cookie,
                    UName:uname,
                    UID:mid,
                }
                setConfig(config)
            }
        }
    }


    const [uid, setUid] = React.useState("");
    const [uname, setUname] = React.useState("");


    useEffect(() => {
        window.addEventListener("message", handleMessage);
        return ( ()=> {
            window.removeEventListener("message", handleMessage);
        })
    })

    return (
        <div>
            <Modal isOpen={true}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">添加账号</ModalHeader>
                        <ModalBody>
                            <div>
                                <div>
                                    <Input label={'Cookie'} value={cookie} onValueChange={setCookie} />
                                    <Button onClick={() => {
                                        window.parent.postMessage({
                                            "action": "nav",
                                            "cookie": cookie
                                        }, "*")
                                    }} className={'mt-2'}>确认</Button>
                                </div>
                                <div className={'flex flex-col items-center justify-center'}>
                                    {uname && <Avatar src={'https://workers.vrp.moe/bilibili/avatar/' + uid}/>}
                                    {uname && <p className={'mt-2'}>{uname}</p>}
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={props.onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={props.onClose}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default AccountForm;