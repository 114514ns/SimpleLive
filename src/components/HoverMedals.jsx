import React, {useEffect, useState} from 'react';
import UserChip from "./UserChip.jsx";
import {Avatar, Chip} from "@heroui/react";

function HoverMedals(props) {
    const [list, setList] = useState([]);

    useEffect(() => {
        (async () => {
            setList(JSON.parse(await ((await fetch('https://live.ikun.dev/medals?mid=' + props.id)).text())).list)
        })()
    }, []);
    return (
        <div className={'flex flex-col overflow-scroll fansMedal overflow-x-hidden'} style={{maxHeight:'600px'}}>
            {list.map((item, index) => (
                <div key={index} className={'mt-2'}>
                    <p className={'font-bold'}>{item.Liver}</p>

                    <div className={'flex flex-row align-middle mt-2'}>
                        <Avatar
                            src={`https://workers.vrp.moe/bilibili/avatar/${item.LiverID}`}
                            onClick={() => {
                                toSpace(item.LiverID);
                            }}/>

                        {item.Level ?              <Chip
                            startContent={item.Type?<img  src={getGuardIcon(item.Type)} className={'w-6 h-6'}/>:<div/>}
                            variant="faded"
                            onClick={() => {
                                toSpace(item.LiverID);
                            }}
                            style={{background: getColor(item.Level), color: 'white', marginLeft: '8px'}}
                        >
                            {item.MedalName}
                            <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full">
                                                            {item.Level}
                                                        </span>
                        </Chip>:<></>}
                    </div>
                </div>
            ))}

        </div>
    );
}



export default HoverMedals;