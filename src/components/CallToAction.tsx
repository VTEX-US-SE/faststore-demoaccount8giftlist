import React from "react";
import style from './CallToAction.module.scss'

export interface CallToActionProps {
    title: string;
    link: {
        text: string;
        url: string;
    };
}

export default function CallToAction(props: CallToActionProps) {
    return (
        <div className={style.btn_teste}>
            <button>
                <a href={props.link.url}>
                    {props.link.text}
                </a>
            </button>
        </div>
    );
}