import React, {useEffect, useState} from 'react';
import UserChip from "./UserChip.jsx";

function HoverMedals(props) {
    const [list, setList] = useState([]);
    /*
    useEffect(() => {
        window.parent.postMessage({
            "action":"medals",
            "data":props.id
        },"*")

        window.addEventListener('message', function(e) {
            if (e.data.action === "medals") {
                setList(e.data.data.data.list)
            }
        })
    }, []);

     */
    return (
        <div>
            {list.map((item, index) => (
                 <UserChip/>
            ))}
        </div>
    );
}



export default HoverMedals;