import { ExoplanetDTO } from ".";
import styles from "./SelectionMenu.module.css"
import axios, {CancelTokenSource} from "axios";
import {useEffect, useRef, useState} from "react";

type SelectionMenuProps = {
  exoplanets?: ExoplanetDTO[]
  clickHandler: (exoplanet: ExoplanetDTO) => void
}

export function SelectionMenu({ exoplanets, clickHandler }: SelectionMenuProps) {
  const [exoplanetsResult, setExoplanetsResult] = useState<ExoplanetDTO[] | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debounceTimeout = useRef<number | null>(null); // Updated type to number
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    // Clean up timeout when component unmounts
    return () => {
      if (debounceTimeout.current) window.clearTimeout(debounceTimeout.current); // Use window.clearTimeout
      if (cancelTokenRef.current) cancelTokenRef.current.cancel();
    };
  }, []);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) window.clearTimeout(debounceTimeout.current); // Use window.clearTimeout

    debounceTimeout.current = window.setTimeout(() => {
      searchHandler(value);
    }, 500); // Adjust debounce time as necessary (e.g., 300ms, 500ms)
  }

  function searchHandler(searchString: string) {
    if (!searchString) {
      setExoplanetsResult(undefined);
      return;
    }

    // Cancel the previous request if it exists
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    // Create a new cancel token for the current request
    cancelTokenRef.current = axios.CancelToken.source();

    axios
      .get(`https://exosky-api.dixen.fr/exoplanets/search?search_string=${searchString}`, {
        cancelToken: cancelTokenRef.current.token,
      })
      .then((response: any) => {
        setExoplanetsResult(response.data as ExoplanetDTO[]);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching data:', error);
        }
      });
  }

  return (
    <section className={styles.selectionMenu}>
      <h1 className={styles.headTitle}>Select an exoplanet</h1>
      <input
        placeholder="Search an exoplanet"
        className={styles.searchInput}
        onChange={handleInputChange}
        value={searchTerm}
      />
      <p className={styles.resultCount}>{(exoplanetsResult || exoplanets || []).length} Exoplanets found !</p>
      <ul>
        {(exoplanetsResult || exoplanets || []).map((exoplanet) => (
          <li key={exoplanet.planet_id} onClick={() => clickHandler(exoplanet)}>
            {exoplanet.planet_id}
          </li>
        ))}
      </ul>
    </section>
  );
}
