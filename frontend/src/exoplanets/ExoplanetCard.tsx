import styles from "./ExoplanetCard.module.css";
import {ExoplanetDTO} from "./index.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

interface ExoplanetCardProps {
  exoplanet: ExoplanetDTO | undefined;
  skyView: Function;
  close: Function;
}

interface ExoplanetDetails {
  disc_facility: string;
  disc_telescope: string;
  hostname: string;
  pl_name: string;
}

export function ExoplanetCard({exoplanet, skyView, close}: ExoplanetCardProps) {
  const [exoplanetDetails, setExoplanetDetails] = useState<ExoplanetDetails | undefined>();

  useEffect(() => {
    if (!exoplanet) {
      return;
    }

    axios.get(`https://exosky-api.dixen.fr/exoplanets/name?exoplanet_name=${exoplanet.planet_id}`).then((response: any) => {
      setExoplanetDetails(response.data as ExoplanetDetails);
    });
  }, [exoplanet]);

  if (!exoplanet) {
    return <div></div>;
  }

  function onClick() {
    skyView(exoplanet);
  }

  return (
    <section className={styles.exoplanetCard}>
      <button onClick={() => close()} className={styles.closeButton}>
        <img src="/close_icon.png" alt="Close"/>
      </button>
      <h1 className={styles.headTitle}>{exoplanet.planet_id}</h1>
      {exoplanetDetails && <div>
          <p><strong>Host:</strong> {exoplanetDetails.hostname}</p>
          <p><strong>Discovery facility:</strong> {exoplanetDetails.disc_facility}</p>
          <p><strong>Discovery telescope:</strong> {exoplanetDetails.disc_telescope}</p>
          <p><strong>Distance:</strong> {exoplanet.distance} parsecs</p>
      </div>}
      <div className={styles.buttonContainer}>
        <button onClick={onClick}>Explore {exoplanet.planet_id} ⭐</button>
      </div>
    </section>
  );
}
