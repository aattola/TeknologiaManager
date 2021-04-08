/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';

import axios from 'axios';
import request from 'request';
import electron, { app, ipcRenderer } from 'electron';

import extract from 'extract-zip';
import fs from 'fs';
import aes256 from 'aes256';
import styled, { css } from 'styled-components';
import TextField from '@material-ui/core/TextField';
import ButtonA from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import icon from '../assets/NewLogo.png';

const Loader = styled(CircularProgress)`
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: ${(props) => (props.loaded ? 0 : 1)};
`;

const LoaderImage = styled.img`
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: ${(props) => (props.loaded ? 0 : 1)};
`;

const RedditTextField = styled.input`
  display: block;
  font-size: 1.6rem;
  padding: 0.5rem;
  margin: 1.25rem 0;
  outline: none;
  background: #313131;
  border: 1px solid #464646;
  border-radius: 6px;
  color: white;
  width: 180px;
`;

const AppToolbar = styled.div`
  background: #313131;
  border: 1px solid #464646;
  border-radius: 6px;
  padding: 0 20px;
  max-height: 54px;
  min-height: 54px;
  justify-content: space-between;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;

  display: flex;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr;
  grid-gap: 20px;
  margin-top: 20px;
`;

const Card = styled.div`
  background: #313131;
  border: 1px solid #464646;
  border-radius: 6px;
  padding: 10px 20px;
`;

const VersionCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0px;
  padding: 10px 20px;

  ${(props) =>
    props.downloaded &&
    css`
      background: white;
      color: black;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    `}
`;

const Button = styled(ButtonA)`
  background: #313131;
  color: white;
  box-sizing: border-box;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  outline: none;
  color: white !important;
  /*
  :focus {
    border: 1px solid #464646;
  }

  :active {
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
  }

  :hover {
    border: 1px solid #464646;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  } */
`;

const ButtonOutlined = styled(Button)`
  border: 1px solid #464646;
  color: white !important;
  margin-bottom: 5px;
`;

const Container = styled.div`
  padding: 20px;
`;

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

      const pa = ipcRenderer.sendSync('synchronous-message', 'home');
      const dir = `${pa}\\Documents\\Destia\\`;
      console.log(dir, pa);
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
    // setLadattu(false);
    setError(false);
    download(i);
  }

  window.startPuppeteer = startPuppeteer;
  window.download = download;
  window.loadIndex = loadIndex;

  return (
    <Container>
      {/* <Ticker>
        {({ index }) => (
          <h1 style={{ color: '#5F9B41' }}>DESTIA PARAS TEKNOLOGIA</h1>
        )}
      </Ticker> */}
      <AppToolbar>
        <>
          <LoaderImage loaded={loading} width="34px" alt="icon" src={icon} />
          <Loader
            loaded={!loading}
            style={{
              color: 'white',
              position: 'absolute',
              left: 0,
              padding: '17px',
            }}
          />
        </>

        <div>
          <h1
            style={{ fontSize: '22px', color: 'white', fontFamily: 'Roboto' }}
          >
            Versiot
          </h1>
        </div>
      </AppToolbar>
      <Grid>
        <Card style={{ height: 'fit-content' }}>
          <h1>Moro {!key && 'kirjoita avaimesi'}</h1>

          <RedditTextField
            onChange={(e) => setKey(e.target.value)}
            value={key}
            type="password"
            label="Avain"
            size="small"
          />

          {ladattu && (
            <div>
              <h3>
                Ladattu: <code>{data[loadedIndex].tag_name}</code>
              </h3>
              <h3>
                HUOM: Sivun resoluutio voi olla väärä. Jos se on luo uusi sivu
                ja siirry käyttämään sitä
              </h3>
              <h3>
                Tosta käynnistät erityisen selaimen johon jo valmiiksi ladattu
                teknologia versio: {data[loadedIndex].tag_name}. Tai lataat sen
                itse chromeen. Lisäosan tiedostot sijaitsee osoitteessa:{' '}
                <code>{`${ipcRenderer.sendSync(
                  'synchronous-message',
                  'home'
                )}\\Documents\\Destia\\`}</code>
              </h3>
              <ButtonOutlined type="button" onClick={startPuppeteer}>
                Käynnistä selain
              </ButtonOutlined>
            </div>
          )}

          <ButtonOutlined
            disabled={loading}
            type="button"
            onClick={() => download()}
          >
            {loading ? 'Ladataan' : 'Lataa uusin'}
          </ButtonOutlined>
        </Card>
        <Card>
          <h1>Versiot:</h1>

          {data[0]
            ? data.map((version, i) => {
                return (
                  <VersionCard downloaded={i === loadedIndex} key={version.id}>
                    <h3 style={{ margin: 0 }}>{version.tag_name}</h3>
                    <Button
                      disabled={i === loadedIndex}
                      onClick={() => loadIndex(i)}
                    >
                      Lataa
                    </Button>
                  </VersionCard>
                );
              })
            : 'Lataa uusin ensin.'}
        </Card>
      </Grid>
    </Container>
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
