import './toastAlert.css'
import { useState, useEffect } from 'react'


// When props.toast goes from null to a toast we want to fade-in
// when it goes back to null we need to fade out.
// During fade out we cannot use props.toast because it is currently null, 
// so we need to store a previous value (textToDisplay)
export const ToastAlert = (props) => {
    const [textToDisplay, setTextToDisplay] = useState(null);
    const [fadeState, setFadeState] = useState('off');

    useEffect(() => {
         if (!textToDisplay && props.toast) {
            setFadeState('fade-in');
            setTextToDisplay(props.toast);
        } else if (textToDisplay && !props.toast) {
            setFadeState('fade-out');
        } else {
            setTextToDisplay(props.toast);
        }
    }, [props.toast, textToDisplay]);

    if (fadeState === 'off') {
        return null; 
    }

    return (
        <div className={`toast-alert ${fadeState}`} onAnimationEnd={() => {
            // console.log("Animation state:", fadeState);
            if (fadeState === 'fade-out') {
                setFadeState('off');
                setTextToDisplay(null);
            } else {
                setFadeState(null);
            }
        }}>
            <p>{textToDisplay}</p>
            <img onClick={() => props.handleToast('close')} src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/1024px-Flat_tick_icon.svg.png'/>
        </div>
    )
}