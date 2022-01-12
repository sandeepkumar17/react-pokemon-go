import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useMemo, useState, useEffect } from "react";
import axios from 'axios';

import ItemList from "./ItemList";

function App() {

  // data state to store the TV Maze API data. Its initial value is an empty array
  const [data, setData] = useState([]);
  const pokemonUrl = "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json";

  // Using useEffect to call the API and set the data
  useEffect(() => {
    (async () => {

      axios.get(pokemonUrl)
      .then((res)=> {
        //console.log(res.data);
        const pokemonObj = [];

        res.data.pokemon.sort((a, b) => (a.name > b.name) ? 1 : -1)
        .forEach(pObj => {
          const nextEvolutionArr = [];

          if(pObj.next_evolution){
            pObj.next_evolution.forEach(eObj => {
              nextEvolutionArr.push(eObj.num + ": " + eObj.name);
            });
          }

          pokemonObj.push({
            id: pObj.id,
            num: pObj.num,
            name: pObj.name,
            type:pObj.type,
            height: pObj.height,
            weight: pObj.weight,
            weaknesses: pObj.weaknesses,
            next_evolution: nextEvolutionArr
          });
        });

        //console.log(pokemonObj);
        setData(pokemonObj);
      })
      .catch((err)=>{
        console.log(err);
      })
    })();
  }, []);

  // Custom component to render badge
  const ResultBadges = ({ values, badgeClass }) => {
    return (
      <>
        {values.map((val, idx) => {
          return (
            <span key={idx} className={badgeClass}>
              {val}
            </span>
          );
        })}
      </>
    );
  };

  const columns = useMemo(
    () =>[
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Number",
        accessor: "num"
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: ({ cell: { value } }) => <ResultBadges values={value} badgeClass="badge badge-secondary" />
      },
      {
        Header: "Height",
        accessor: "height"
      },
      {
        Header: "Weight",
        accessor: "weight"
      },
      {
        Header: "Weaknesses",
        accessor: "weaknesses",
        Cell: ({ cell: { value } }) => <ResultBadges values={value} badgeClass="badge badge-warning" />
      },
      {
        Header: "Next Evolution",
        accessor: "next_evolution",
        Cell: ({ cell: { value } }) => <ResultBadges values={value} badgeClass="badge badge-info" />
      }
    ],
    []
  );

  return (
    <div className="App">
      <div className="row">
        <div className="col-lg-12">
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mt-1 mb-1" href="#">Table Example</a>
          </nav>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg-1">
        </div>
        <div className="col-lg-10">
          <br />
          <h2>Pokemon Table List</h2>
          <ItemList columns={columns} data={data} />
        </div>
        <div className="col-lg-1">
        </div>
      </div>
    </div>
  );

}

export default App;
