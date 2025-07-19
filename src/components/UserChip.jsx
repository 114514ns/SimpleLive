import React, {useEffect} from 'react';
import {Avatar, Chip} from "@heroui/react";


const CheckIcon = React.memo(({size = 24, color = "currentColor", ...props}) => {
    return (
        <svg width={size} height={size} {...props}>
            <use href="#icon-check" fill={color}/>
        </svg>
    );
});

function UserChip(props) {


    return (
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
    );
}

const getColor = (level) => {
    if (level <= 4) {
        return "#5762A799"
    }
    if (level <= 8) {
        return "#5866C799"
    }
    if (level <= 12) {
        return "#9BA9EC"
    }
    if (level <= 16) {
        return "#DA9AD8"
    }
    if (level <= 20) {
        return "#C79D24"
    }
    if (level <= 24) {
        return "#67C0E7"
    }
    if (level <= 28) {
        return "#6C91F2"
    }
    if (level <= 32) {
        return "#A97EE8"
    }
    if (level <= 36) {
        return "#C96B7E"
    }
    if (level <= 40) {
        return "#FF9D55"
    }


}
export default UserChip;