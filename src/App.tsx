/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';

import axios from 'axios';
import request from 'request';

import extract from 'extract-zip';
import fs from 'fs';
import aes256 from 'aes256';
import { ipcRenderer } from 'electron';
import icon from '../assets/Logo.png';

const Hello = () => {
  const [loading, setLoading] = useState(false);
  const [ladattu, setLadattu] = useState(false);
  const [key, setKey] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loadedIndex, setLoadedIndex] = useState(0);

  useEffect(() => {
    if (window.localStorage.getItem('destia')) {
      setKey(window.localStorage.getItem('destia'));
    } else {
      window.localStorage.setItem('destia', key);
    }
  }, []);

  async function download(i = 0) {
    setLoading(true);
    setError(false);

    try {
      const encryptedKey =
        'luFkjEJGhszZ8zKelTIMoc9tmYYWYVzWhFjKkXxn/Fb8lHD3DY6upypSjOuma6C05jajTDTnVRo=';
      const decryptedPlainText = aes256.decrypt(key, encryptedKey);

      console.log(decryptedPlainText);
      const kissa = JSON.stringify({ delete: { values: ['111'] } });

      const config: any = {
        method: 'get',
        url: 'https://api.github.com/repos/jeffeeeee/Teknologia/releases',
        headers: {
          Authorization: `Bearer ${decryptedPlainText}`,
          'Content-Type': 'application/json',
        },
        data: kissa,
      };

      const res = await axios(config);
      const { id } = res.data[i].assets[0];
      const name = `${res.data[i].assets[0].node_id}${res.data[i].assets[0].name}`;

      const options = {
        method: 'GET',
        url: `https://api.github.com/repos/jeffeeeee/Teknologia/releases/assets/${id}`,
        headers: {
          Accept: 'application/octet-stream',
          Authorization: `Bearer ${decryptedPlainText}`,
          'Content-Type': 'application/json',
          'User-Agent': 'kissa',
        },
        body: JSON.stringify({ delete: { values: ['111'] } }),
      };

      const dir = `${process.env.HOME}\\Documents\\Destia\\`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const stream = request(options).pipe(fs.createWriteStream(dir + name));
      stream.on('finish', async function () {
        await extract(dir + name, { dir });
        console.log('DONEEEE');
        setLoading(false);
        setData(res.data);
        setLadattu(true);
        setLoadedIndex(i);
      });
    } catch (err) {
      console.log('error', err);
      setError(err);
      setLoading(false);
    }
  }

  async function startPuppeteer() {
    ipcRenderer.send('synchronous-message', 'puppeteer');
  }

  async function loadIndex(i) {
    setLoading(true);
    setLadattu(false);
    setError(false);
    download(i);
  }

  window.startPuppeteer = startPuppeteer;
  window.download = download;
  window.loadIndex = loadIndex;

  return (
    <div>
      {/* <Ticker>
        {({ index }) => (
          <h1 style={{ color: '#5F9B41' }}>DESTIA PARAS TEKNOLOGIA</h1>
        )}
      </Ticker> */}
      <div className="Hello">
        <img width="250px" alt="icon" src={icon} />
      </div>
      <center>
        <h1 style={{ color: '#5F9B41' }}>Tosta vaan ladaten pistät</h1>
        {!key && (
          <h3>
            Muista kirjoittaa oikein koska tää tallennetaan tulevaisuutta varten
            tähän. Joten ekalla kirjotatkin oikein
          </h3>
        )}
        <input
          type="password"
          onChange={(e) => setKey(e.target.value)}
          value={key}
        />
        {error && (
          <h3>Joku virhe varmaa salasana väärin: {JSON.stringify(error)}</h3>
        )}
      </center>
      <div className="Hello">
        {!ladattu ? (
          <button disabled={loading} type="button" onClick={() => download()}>
            {loading ? 'Ladataan' : 'Lataa uusin'}
          </button>
        ) : (
          <div>
            <h1>
              Ladattu: <code>{data[loadedIndex].tag_name}</code>
            </h1>
            <h3>
              HUOM: Sivun resoluutio voi olla väärä. Jos se on luo uusi sivu ja
              siirry käyttämään sitä
            </h3>
            <p>
              Tosta käynnistät erityisen selaimen johon jo valmiiksi ladattu
              teknologia versio: {data[loadedIndex].tag_name}. Tai lataat sen
              itse chromeen. Lisäosan tiedostot sijaitsee osoitteessa:{' '}
              <code>{`${process.env.HOME}\\Documents\\Destia\\`}</code>
            </p>
            <button type="button" onClick={startPuppeteer}>
              Käynnistä selain
            </button>
          </div>
        )}
        <div>
          <button type="button" onClick={() => window.close()}>
            Sulje
          </button>

          {data[0] && <p>Versiot: </p>}
          {data.map((version, i) => {
            return (
              <p
                onClick={() => loadIndex(i)}
                style={{ margin: 0, cursor: 'pointer' }}
                key={version.id}
              >
                <code>{version.tag_name}</code>
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
