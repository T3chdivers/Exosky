import { ExoplanetDTO } from ".";
import { Link } from "react-router-dom";
import styles from "./SelectionMenu.module.css"

type SelectionMenuProps = {
  exoplanets?: ExoplanetDTO[]
}

export function SelectionMenu({exoplanets}: SelectionMenuProps) {
  if (!exoplanets?.length) return null;

  return (
    <section className={styles.selectionMenu}>
      <h1 className={styles.headTitle}>Select an exoplanet</h1>
      <ul>{
        exoplanets.map((exoplanet) =>
          <li>
            <Link to={`/${exoplanet.x}/${exoplanet.y}/${exoplanet.z}`}>{exoplanet.planet_id}</Link>
          </li>
        )
      }</ul>
    </section>
  );
}
