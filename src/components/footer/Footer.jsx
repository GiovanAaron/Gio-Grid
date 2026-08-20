import React from "react";
import styles from "./footer.module.css";
import githubLogo from "../../assets/github_logo.svg"; // Adjust the path as necessary

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.developer}>
          <p>Developed by Giovan Aaron</p>
          <a href="https://github.com/GiovanAaron" target="_blank" rel="noopener noreferrer">
            <img src={githubLogo} alt="Developer Image" className={styles.logo} />
          </a>
        </div>
        <p>&copy; 2024 Eco Grid Monitor. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
