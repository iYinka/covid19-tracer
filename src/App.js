import React, { useEffect, useState } from 'react'
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import './App.css'
import Table from './Table'
import { prettyPrintstat, sortData } from './util'
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css"


// Web for API: disease.sh
// General API: https://disease.sh/v3/covid-19/countries
// Specific Country API: https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
// Worlwide API: https://disease.sh/v3/covid-19/all


function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter]=useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases");

  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);


  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //Nigeria, United States
            value: country.countryInfo.iso2 //Ng, US
          }));

          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data)
          setCountries(countries);
        })
    }

    getCountriesData();
  }, []);
  
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    // console.log("Code is:", countryCode);

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })
  };

  return (
    <div className="app">
      <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 UPDATES</h1>
            <FormControl className="app__dropdown">
                <Select variant="outlined" value={country} onChange={onCountryChange}>
                  <MenuItem value={"worldwide"}>Worldwide</MenuItem>
                  {
                    countries.map((country) => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                  }
              </Select>
            </FormControl>
          </div>
          
          {/* INFO BOXES */}
          <div className="app__stats">
              <InfoBox
                isRed
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                title="Cases"
                cases={prettyPrintstat(countryInfo.todayCases)}
                total={prettyPrintstat(countryInfo.cases)}   
              />
              <InfoBox 
                active={casesType === "recovered"} 
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                cases={prettyPrintstat(countryInfo.todayRecovered)}
                total={prettyPrintstat(countryInfo.recovered)} 
                />
              <InfoBox 
                isRed
                active={casesType === "deaths"} 
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                cases={prettyPrintstat(countryInfo.todayDeaths)}
                total={prettyPrintstat(countryInfo.deaths)} 
              />
          </div>

          {/* MAP */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* TABLE */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          
          {/* GRAPH */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph classname="app__graph" casesType={casesType} />
        </CardContent>
            <div className="footer">©️ {new Date().getFullYear()}</div>
      </Card>

    </div>
        

 
  );
}

export default App;
