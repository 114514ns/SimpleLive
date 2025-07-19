import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Badge, Card, CardBody} from "@heroui/react";

function LiverChip(props) {
    const ref = useRef();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setWidth(width);
                setHeight(height);
                console.log(width, height);
            }
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);
    return (
        <div ref={ref}>
            <Card style={{
                margin: "10px",
                background: props.selected ? 'rgba(105,205,255,0.2)' : '',
                width: '90%'
            }} isHoverable={true} onPress={props.onClick} isPressable={true}>
                <CardBody>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap"
                    }}>
                        <div style={{display: "flex", alignItems: "center", gap: "8px", minWidth: 0}}>
                            <Badge color={props.item.face ? "success" : "default"} content="">
                                <Avatar src={props.item.face}
                                        onClick={() => toSpace(props.item.mid)}/>
                            </Badge>

                            <div style={{minWidth: 0}}>
                                <p style={{
                                    margin: 0,
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "120px"
                                }} >
                                    {props.item.uname}
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "#888",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "180px"
                                }} >
                                    {props.item.Title}
                                </p>
                            </div>
                        </div>
                        {width>200 && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                        }
                       </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default LiverChip;