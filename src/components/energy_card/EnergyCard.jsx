import { useCallback, useEffect, useState } from "react";
import loaderIcon from "../../assets/gio_grid_loader.svg";
import gioGridTrademark from "../../assets/GioGridTM.svg";
import welcomeLogo from "../../assets/welcome_logo.svg";
import fetchEnergyData from "../../hook/apiCall";
import {
  calculateEnergyTotals,
  calculateGreenPercentage,
  compareEnergyTotals,
  filterByBaselineSettlementPeriod,
} from "../../utils/data_context";
import DataVis from "../bar_chart/DataVis";
import styles from "./EnergyCard.module.css";

const MINIMUM_LOADING_TIME = 3000;
const WELCOME_DURATION = 9440;

function WelcomeContent() {
  return (
    <div className={styles.welcome}>
      <img src={welcomeLogo} alt="Welcome to Eco Grid Monitor" />
    </div>
  );
}

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
        <p className={styles.heading}>{isGreen ? "Good news!" : "Oh no!"}</p>
        <p>
          Fossil Fuel consumption is {isGreen ? "down" : "up by"}{" "}
          <span className={styles.rate}>{rate}%</span> from yesterday at this
          hour
        </p>
      </div>
      {!isGreen && (
        <p className={styles.advisory}>
          We advise that you reduce your energy consumption
        </p>
      )}
      <button
        type="button"
        className={styles.refreshButton}
        onClick={onRefresh}
      >
        Check Again
      </button>
      <i className={styles.disclaimer}>
        Disclaimer: Energy data is reported with an approximate 90-minute delay.
      </i>
    </div>
  );
}

function EnergyCard() {
  const [state, setState] = useState({ status: "loading", result: null });
  const [isShowingWelcome, setIsShowingWelcome] = useState(true);
  const [isShowingAbout, setIsShowingAbout] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipCard = (showAbout) => {
    setIsFlipping(true);
    setIsShowingAbout(showAbout);
  };

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading" }));
    try {
      const [data] = await Promise.all([
        fetchEnergyData(),
        new Promise((resolve) => setTimeout(resolve, MINIMUM_LOADING_TIME)),
      ]);
      const filteredData = filterByBaselineSettlementPeriod(data);
      const yesterdayEnergyTotals = calculateEnergyTotals(filteredData[0]);
      const todayEnergyTotals = calculateEnergyTotals(filteredData.at(-1));

      setState({
        status: "success",
        result: {
          todayEnergyTotals,
          greenPercentage: calculateGreenPercentage(todayEnergyTotals),
          insights: compareEnergyTotals(
            yesterdayEnergyTotals,
            todayEnergyTotals,
          ),
        },
      });
    } catch (error) {
      setState({ status: "error", result: null, error });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const welcomeTimer = window.setTimeout(() => {
      setIsShowingWelcome(false);
    }, WELCOME_DURATION);

    return () => window.clearTimeout(welcomeTimer);
  }, []);

  return (
    <section className={styles.card}>
      <div
        className={`${styles.cardInner} ${isShowingAbout ? styles.flipped : ""}`}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === "transform"
          ) {
            setIsFlipping(false);
          }
        }}
      >
        <div
          className={`${styles.face} ${styles.front}`}
          aria-hidden={isShowingAbout}
        >
          {!isShowingWelcome && (
            <>
              <button
                type="button"
                className={styles.infoButton}
                aria-label="About Eco Grid Monitor"
                onClick={() => flipCard(true)}
              >
                ?
              </button>
              <img
                className={styles.logo}
                src={gioGridTrademark}
                alt="Gio Grid"
              />
            </>
          )}
          <div className={styles.content}>
            {isShowingWelcome && <WelcomeContent />}
            {!isShowingWelcome && state.status === "loading" && (
              <LoadingContent />
            )}
            {!isShowingWelcome && state.status === "success" && (
              <ResultContent result={state.result} onRefresh={refresh} />
            )}
            {!isShowingWelcome && state.status === "error" && (
              <div className={styles.error} role="alert">
                <p>We couldn't load the latest energy data.</p>
                <button
                  type="button"
                  className={styles.refreshButton}
                  onClick={refresh}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
          {!isShowingWelcome && (
            <small className={styles.attribution}>-Powered by ElexonAPI-</small>
          )}
          {isFlipping && (
            <div className={styles.flipOverlay} aria-hidden="true" />
          )}
        </div>

        <div
          className={`${styles.face} ${styles.back}`}
          aria-hidden={!isShowingAbout}
        >
          <button
            type="button"
            className={styles.infoButton}
            aria-label="Return to energy results"
            onClick={() => flipCard(false)}
          >
            ×
          </button>
          <div className={styles.aboutContent}>
            <h2>About Gio\/Grid ⚡️</h2>
            <p>
              Gio\/Grid makes Great Britain’s
              changing energy mix easy to understand. Using live
              electricity-generation data from the Elexon API, it shows how much
              power is being produced from sources such as wind, solar, gas,
              nuclear and biomass. </p>
              <p>This mini-app groups each source by its
              environmental impact, helping users see at a glance how green the
              grid currently is. When fossil-fuel generation is high, it
              encourages users to reduce or delay non-essential electricity use,
              turning complex industry data into clear, practical guidance.
            </p>
          </div>
          {isFlipping && (
            <div className={styles.flipOverlay} aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
}

export default EnergyCard;
