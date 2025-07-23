import React, {useEffect} from 'react';
import {Avatar, Chip, Tooltip} from "@heroui/react";
import HoverMedals from "./HoverMedals.jsx";


const CheckIcon = React.memo(({size = 24, color = "currentColor", ...props}) => {
    return (
        <svg width={size} height={size} {...props}>
            <use href="#icon-check" fill={color}/>
        </svg>
    );
});

function UserChip(props) {


    return (
        <Tooltip content={<HoverMedals id={props.item.UID}/>}>
            <div className={'mt-3'}>
                <span className={'font-bold'}>{props.item.UName}</span>
                <div className={'flex flex-row align-middle mt-1'}>
                    <Avatar
                        src={props.item.Face}
                        onClick={() => {
                            toSpace(props.item.UID);
                        }}/>

                    {props.item.MedalLevel ? <Chip
                        startContent={
                            props.item.GuardLevel ? <img src={getGuardIcon(props.item.GuardLevel)}
                                                         style={{width: '20px', height: '20px'}}></img> :
                                <CheckIcon size={18}/>
                        }
                        variant="faded"
                        onClick={() => {
                            toSpace(props.item.LiverID);
                        }}
                        style={{background: getColor(props.item.MedalLevel), color: 'white', marginLeft: '8px'}}
                        className="mt-1"
                    >
                        {props.item.MedalName}
                        <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full">
                                                            {props.item.MedalLevel}
                                                        </span>
                    </Chip> : <></>}
                </div>

            </div>
        </Tooltip>
    );
}

export default UserChip;