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
    Form
} from "@heroui/react";

function isFloat(str) {
    const num = parseFloat(str);
    return !isNaN(num) && isFinite(num) && str.trim() !== '' && str.includes('.');
}

function SettingsForm(props) {
    const [topGiftPrice, setTopGiftPrice] = React.useState("0");

    const [topPriceState, setTopPriceState] = React.useState(false);


    useEffect(() => {
        setTopPriceState(isFloat(topGiftPrice))
    }, [topGiftPrice]);

    return (
        <div>
            <Modal isOpen={true}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">设置</ModalHeader>
                        <ModalBody>
                            <div>
                                <Switch defaultSelected={getConfig().Anonymous} aria-label="匿名模式" onValueChange={e => {
                                    const cfg = getConfig();
                                    cfg.Anonymous = e
                                    setConfig(cfg)
                                }
                                }>匿名模式</Switch>

{/*                                <Autocomplete
                                    className="mt-4"
                                    defaultItems={ [
                                        {label: "0", key: "0"},
                                        {label: "1", key: "1"},
                                        {label: "2", key: "2"},
                                        {label: "3", key: "3"},
                                        {label: "4", key: "4"},
                                    ]}
                                    label="置顶礼物数量"
                                    placeholder="0"
                                    onSelectionChange={e => {
                                        const cfg = getConfig();
                                        cfg.TopGiftNum = e
                                        setConfig(cfg)
                                    }}
                                >
                                    {(animal) => <AutocompleteItem key={animal.key}>{animal.label}</AutocompleteItem>}
                                </Autocomplete>

                                <Input
                                    className=" mt-4"
                                    label="置顶礼物最小金额"
                                    onValueChange={setTopGiftPrice}
                                    isInvalid={topPriceState}
                                    color={topPriceState ? "danger" : "default"}
                                    errorMessage="Please enter a valid email"
                                />*/}

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

export default SettingsForm;