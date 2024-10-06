import styles from "./Loader.module.css";

export function Loader() {
  return (
    <div className={styles.loader_container}>
      <span className={styles.spinner}></span>
    </div>
  );
}
