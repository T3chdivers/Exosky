import styles from "./ExoplanetCard.module.css";
import {ExoplanetDTO} from "./index.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

interface ExoplanetCardProps {
  exoplanet: ExoplanetDTO;
}

interface ExoplanetDetails {
  disc_facility: string;
  disc_telescope: string;
  hostname: string;
  pl_name: string;
}

export function ExoplanetCard({exoplanet}: ExoplanetCardProps) {
  const [exoplanetDetails, setExoplanetDetails] = useState<ExoplanetDetails | undefined>();

  useEffect(() => {
    axios.get(`https://exosky-api.dixen.fr/exoplanets/name?exoplanet_name=${exoplanet.planet_id}`).then((response: any) => {
      setExoplanetDetails(response.data as ExoplanetDetails);
    });
  }, [exoplanet]);

  return (
    <section className={styles.exoplanetCard}>
      <h1 className={styles.headTitle}>{exoplanet.planet_id}</h1>
      {exoplanetDetails && <div>
          <p><strong>Host:</strong> {exoplanetDetails.hostname}</p>
          <p><strong>Discovery facility:</strong> {exoplanetDetails.disc_facility}</p>
          <p><strong>Discovery telescope:</strong> {exoplanetDetails.disc_telescope}</p>
          <p><strong>Distance:</strong> {exoplanet.distance} parsecs</p>
      </div>}
      <div className={styles.buttonContainer}>
        <Link to={`/${exoplanet.x}/${exoplanet.y}/${exoplanet.z}/${encodeURI(exoplanet.planet_id)}`}>
          <button>Explore {exoplanet.planet_id} ⭐</button>
        </Link>
      </div>
    </section>
  );
}
