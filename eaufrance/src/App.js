import './App.css';
import axios from 'axios'
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto'
import React, { useEffect, useState } from "react";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [state, setState] = useState({listCodeStationCode: [], listCodeStationName:[], listTemp:[], listHeures: [], nameStation: "null", color1: 0});

  useEffect(() => {

    axios.get('https://hubeau.eaufrance.fr/api/v1/temperature/station?size=50&exact_count=true&format=json', {
  
    })
    .then(function (response) {
      console.log("je suis appeller une fois au debut")
      //console.log(response.data);
      //console.log(response.data.data[0].libelle_station)
      //console.log(response.data.data[0].code_station)
      let listCode = [];
      let listName = [];
      response.data.data.forEach(element => {
        listCode.push(element.code_station);
        listName.push(element.libelle_station);
      });
      setState({listCodeStationCode: listCode, listCodeStationName: listName});
    })
    .catch(function (error) {
      console.log(error);
    });

  }, []);

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
        suggestedMax: 20,
        suggestedMin: 10,
    }
}
};

let data = {
  labels : state.listHeures,
  datasets: [
    {
      id: 1,
      label: "station : "+ state.nameStation,
      data: state.listTemp,
      backgroundColor: "rgb("+state.color1+", 0, 0)",
    }
  ],
};

function getTemperature(numero, name, index, sizeMax){
  let compteur = 0;
  axios.get("https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station="+numero+"&size=25&sort=desc&pretty", { })
  .then(function (response) {
    const listTempArray = [];
    const listHeuresArray = [];
    response.data.data.forEach(element => {
      listTempArray.push(element.resultat);
      listHeuresArray.push(compteur+" h");
      compteur=compteur+1;
    });
    const colorToPut = (index/sizeMax)*255;
    console.log(colorToPut);
    setState({listCodeStationCode: state.listCodeStationCode, listCodeStationName: state.listCodeStationName, listTemp: listTempArray, listHeures: listHeuresArray,nameStation: name, color1: colorToPut });
  })
  .catch(function (error) {
    console.log(error);
  });
}

  return (
      <div>

        <p className="title">Bar Char find temperature with station api</p>

        <DropdownButton id="dropdown-basic-button" variant="secondary" title="Choose station in list" size="sm">
        {state.listCodeStationCode.length > 0 && state.listCodeStationName.length > 0?
          state.listCodeStationCode.map(function(object, i){
              return <Dropdown.Item onClick={() => getTemperature(object, state.listCodeStationName[i], i, state.listCodeStationName.length)} key={i}>{state.listCodeStationName[i]}</Dropdown.Item>;
          })
          : <div></div>
        }
        </DropdownButton>

        <Line options={options} data={data} />
      </div>
  );

}

export default App;
