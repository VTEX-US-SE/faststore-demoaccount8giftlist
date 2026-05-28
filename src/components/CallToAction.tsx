import React from "react";
import styles from './CallToAction.module.scss'

export interface CallToActionProps {
  title: string;
  link: {
    text: string;
    url: string;
  };
}

export default function CallToAction(props: CallToActionProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{props.title}</h2>
      <a href={props.link.url} className={styles.link}>
        {props.link.text}
      </a>
    </div>
  );
}
