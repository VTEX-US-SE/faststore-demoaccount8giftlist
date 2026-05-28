import React from "react";
import styles from "./CallToAction.module.scss";

export interface CallToActionProps {
  title: string;
  link: {
    text: string;
    url: string;
  };
}

export default function CallToAction(props: CallToActionProps) {
  const { title, link } = props;

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <a className={styles.button} href={link.url}>
          {link.text}
        </a>
      </div>
    </section>
  );
}
