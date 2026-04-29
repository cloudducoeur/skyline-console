import React from 'react';
import styles from './index.less';

const STATUS_URL = 'https://status.infra.rdcnet.org/status/cdc';

const AppFooter = ({ variant = 'app' }) => {
  const footerClass =
    variant === 'auth'
      ? `${styles.footer} ${styles['footer-auth']}`
      : `${styles.footer} ${styles['footer-app']}`;

  return (
    <div className={footerClass}>
      <p className={styles['footer-text']}>
        © Les Restaurants du Cœur - Les relais du Cœur
        <span className={styles['footer-separator']}> - </span>
        <a
          href={STATUS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles['footer-link']}
        >
          Etat des services
        </a>
      </p>
    </div>
  );
};

export default AppFooter;
