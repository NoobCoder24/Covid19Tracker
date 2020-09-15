import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox.js";
import Map from "./Map.js";
import Table from "./Table.js";
import { sortData, prettyPrintStat } from "./Util.js";
import LineGraph from "./LineGraph.js";
import "leaflet/dist/leaflet.css";
import "./App.css";
import TextTransition, { presets } from "react-text-transition";

function App() {
  const [countries, setCountries] = useState([]);

  const [country, setCountry] = useState("worldwide");

  const [countryInfo, setCountryInfo] = useState({});

  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });

  const [mapZoom, setMapZoom] = useState(4);

  const [mapCountries, setMapCountries] = useState([]);

  const [casesType, setCasesType] = useState("cases");

  // const TEXTS = ["Covid19-Tracker"];

  // const [index, setIndex] = useState(0);

  // useEffect(() => {
  //   const intervalId = setInterval(
  //     () => setIndex((index) => index + 1),
  //     1000 // every 3 seconds
  //   );
  // });

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //STATE = How to write a variable in REACT<<<<<

  //https://disease.sh/v3/covid-19/countries

  //USEEFFECT = Runs a piece of code
  //based on a given condition

  useEffect(() => {
    //the code inside here will run once when the component loads and not again
    //async->send a request , wait  for it to do something with

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //United States,United kingdom
            value: country.countryInfo.iso3, // UK, USA,FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);

        //All of the data from the country response
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  console.log("Set>>>>", countryInfo);

  return (
    <div className="app">
      <div className="app_Left">
        <div className="app_header">
          <img
            src="https://cdn.iconscout.com/icon/premium/png-64-thumb/virus-2234143-1870647.png"
            alt="Covid19"
          />
          <h1> Covid19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {/* Loop through all the countries and show  a dropdown List of options */}
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="CoronaVirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />

          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />

          {/* <InfoBox
          active={casesType === "tests"} 
          onClick={e=>setCasesType('tests')}
          title="Tests Done" 
          cases={prettyPrintStat(countryInfo.testsPerOneMillion)} 
          total={prettyPrintStat(countryInfo.tests)} 
       /> */}
        </div>
        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3 className="app_graphTitle">WorldWide New {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
      <div className="container">
        <div className="app_footer">
          <h2>
            Created By {""}
            <a href="https://thenoobcoder.ml/" target="_blank">
              NoobCoder24/7
            </a>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default App;
