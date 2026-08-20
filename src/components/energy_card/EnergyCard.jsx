import { useCallback, useEffect, useState } from 'react';
import loaderIcon from '../../assets/loader_icon.svg';
import rendescoGridLogo from '../../assets/rendesco_grid_logo.svg';
import fetchEnergyData from '../../hook/apiCall';
import {
  calculateEnergyTotals,
  calculateGreenPercentage,
  compareEnergyTotals,
  filterByBaselineSettlementPeriod,
} from '../../utils/data_context';
import DataVis from '../bar_chart/DataVis';
import styles from './EnergyCard.module.css';

const MINIMUM_LOADING_TIME = 3000;

function LoadingContent() {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <img src={loaderIcon} alt="" />
      <span>Loading...</span>
    </div>
  );
}

function ResultContent({ result, onRefresh }) {
  const isGreen = !result.insights.isRising;
  const rate = Math.abs(result.insights.notGreenPercentage).toFixed(2);

  return (
    <div className={styles.result}>
      <div className={styles.greenPercentage}>
        <span className={isGreen ? styles.greenDot : styles.amberDot} />
        <p>{result.greenPercentage}% Green Power</p>
      </div>
      <DataVis stats={result.todayEnergyTotals} />
      <div className={styles.resultText}>
        <p className={styles.heading}>{isGreen ? 'Good news!' : 'Oh no!'}</p>
        <p>
          Fossil Fuel consumption is {isGreen ? 'down' : 'up by'}{' '}
          <span className={styles.rate}>{rate}%</span> from yesterday at this hour
        </p>
      </div>
      {!isGreen && (
        <p className={styles.advisory}>
          We advise that you reduce your energy consumption
        </p>
      )}
      <button type="button" className={styles.refreshButton} onClick={onRefresh}>
        Check Again
      </button>
      <i className={styles.disclaimer}>
        Disclaimer: Energy data is reported with an approximate 90-minute delay.
      </i>
    </div>
  );
}

function EnergyCard() {
  const [state, setState] = useState({ status: 'loading', result: null });
  const [isShowingAbout, setIsShowingAbout] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipCard = (showAbout) => {
    setIsFlipping(true);
    setIsShowingAbout(showAbout);
  };

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, status: 'loading' }));
    try {
      const [data] = await Promise.all([
        fetchEnergyData(),
        new Promise((resolve) => setTimeout(resolve, MINIMUM_LOADING_TIME)),
      ]);
      const filteredData = filterByBaselineSettlementPeriod(data);
      const yesterdayEnergyTotals = calculateEnergyTotals(filteredData[0]);
      const todayEnergyTotals = calculateEnergyTotals(filteredData.at(-1));

      setState({
        status: 'success',
        result: {
          todayEnergyTotals,
          greenPercentage: calculateGreenPercentage(todayEnergyTotals),
          insights: compareEnergyTotals(yesterdayEnergyTotals, todayEnergyTotals),
        },
      });
    } catch (error) {
      setState({ status: 'error', result: null, error });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);



  return (
    <section className={styles.card}>
      <div
        className={`${styles.cardInner} ${isShowingAbout ? styles.flipped : ''}`}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === 'transform') {
            setIsFlipping(false);
          }
        }}
      >
        <div className={`${styles.face} ${styles.front}`} aria-hidden={isShowingAbout}>
          <button
            type="button"
            className={styles.infoButton}
            aria-label="About Eco Grid Monitor"
            onClick={() => flipCard(true)}
          >
            ?
          </button>
          <img className={styles.logo} src={rendescoGridLogo} alt="Rendesco Grid" />
          <div className={styles.content}>
            {state.status === 'loading' && <LoadingContent />}
            {state.status === 'success' && (
              <ResultContent result={state.result} onRefresh={refresh} />
            )}
            {state.status === 'error' && (
              <div className={styles.error} role="alert">
                <p>We couldn't load the latest energy data.</p>
                <button type="button" className={styles.refreshButton} onClick={refresh}>
                  Try Again
                </button>
              </div>
            )}
          </div>
          <small className={styles.attribution}>-Powered by ElexonAPI-</small>
          {isFlipping && <div className={styles.flipOverlay} aria-hidden="true" />}
        </div>

        <div className={`${styles.face} ${styles.back}`} aria-hidden={!isShowingAbout}>
          <button
            type="button"
            className={styles.infoButton}
            aria-label="Return to energy results"
            onClick={() => flipCard(false)}
          >
            ×
          </button>
          <div className={styles.aboutContent}>
            <h2>About Eco Grid Monitor</h2>
            <p>
              The Eco Grid Monitor is a single-page React application that displays the
              environmental impact of the electricity grid in Great Britain. Using real-time
              data from the Elexon API, the app shows the amount of power generated from
              various fuel sources, categorizing them as &quot;green&quot; or &quot;not green.&quot;
              The component also encourages users to reduce energy consumption when fossil
              fuel usage is high, promoting sustainable energy usage.
            </p>
          </div>
          {isFlipping && <div className={styles.flipOverlay} aria-hidden="true" />}
        </div>
      </div>
    </section>
  );
}

export default EnergyCard;
