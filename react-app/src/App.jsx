import { useEffect, useState } from 'react';
import style from './App.module.scss';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const KEY = "KANTNOLI"; // Loading version [{ version: "1.20.4", type: "release" }]
const KEY2 = "https://t.me/KANTNOLI"; // Active session

function App() {
  const [toggleVersionData, setToggleVersionData] = useState("release");
  const [versionsDef, setVersionsDef] = useState([]);
  const [versionsForge, setVersionsForge] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [chooseVersion, setChooseVersion] = useState({ version: "1.20.4", type: "release" });
  const [downloadMax, setDownloadMax] = useState(1);
  const [minecraftLoad, setMinecraftLoad] = useState(0);
  const [stateLoad, setStateLoad] = useState(false);

  const [button, setButton] = useState("загрузить");

  const toggleVersion = () => {
    setToggleVersionData(toggleVersionData === "release" ? "forge" : "release");
  }

  const handleChooseVersion = (version, type) => {
    setChooseVersion({ version, type });
    localStorage.setItem(KEY2, JSON.stringify({ version, type }));
  }

  const playing = () => {
    socket.emit("game", JSON.stringify({
      username: "KANTNOLI",
      password: "",
      root: "./Minecrarft",
      version: chooseVersion.version,
      type: chooseVersion.type,
      memoryMax: "2",
      memoryMin: "1"
    }));
  }

  useEffect(() => {
    socket.on('download', (data) => {
      if (data.type === "assets" || data.type === "classes" || data.type === "natives") {
        setStateLoad(true);
        setDownloadMax(data.total);
        setMinecraftLoad(data.task);
      }
      if (data.task === data.total && data.type === "assets") {
        let activeVersion = JSON.parse(localStorage.getItem(KEY2))
        setStateLoad(false);
        let getLocalVersion = JSON.parse(localStorage.getItem(KEY))
        getLocalVersion ? localStorage.setItem(KEY, JSON.stringify([...getLocalVersion, { version: activeVersion.version, type: activeVersion.type }])) :
          localStorage.setItem(KEY, JSON.stringify([{ version: activeVersion.version, type: activeVersion.type }]))

        setDownloads(JSON.parse(localStorage.getItem(KEY)));
      }


      console.log(data);
    });

    socket.on('finish', (data) => {
      setStateLoad(false);
      console.log("data " + data);
    });

    if (localStorage.getItem(KEY)) {
      setDownloads(JSON.parse(localStorage.getItem(KEY)));
    }
    if (localStorage.getItem(KEY2)) {
      setChooseVersion(JSON.parse(localStorage.getItem(KEY2)));
    }

    fetch("https://mc-versions-api.net/api/java")
      .then((response) => response.json())
      .then((versions) => {
        setVersionsDef(versions.result);
      });
    fetch("https://mc-versions-api.net/api/forge")
      .then((response) => response.json())
      .then((versions) => {
        setVersionsForge(Object.keys(versions.result[0]));
      });
  }, []);

  const buttonContent = () => {
    let type = downloads.find(el => el.type === chooseVersion.type && el.version === chooseVersion.version) ? 1 : 0

    if(type && minecraftLoad){
      return "запуск"
    } else if(!type && minecraftLoad) {
      return "загрузка файлов"
    } else if(!type && !minecraftLoad) {
      return "скачать"
    } else if(type && !minecraftLoad) {
      return "играть"
    }
  }

  return (
    <div className={style.body}>
      <section className={style.panel}>
        <button onClick={toggleVersion} className={style.toggleVer}>{toggleVersionData}</button>
        <nav className={style.nav}>
          {toggleVersionData === "release"
            ? versionsDef.map((version, id) => (
              <p key={id}
                onClick={() => handleChooseVersion(version, toggleVersionData)}
                className={downloads.find(el => el.type === toggleVersionData && el.version === version) ? style.activeP : style.defaultP}
              >
                {version}{downloads.find(el => el.type === toggleVersionData && el.version === version) ? " ✔" : ""}
              </p>
            ))
            : versionsForge.map((version, id) => (
              <p key={id}
                onClick={() => handleChooseVersion(version, toggleVersionData)}
                className={downloads.find(el => el.type === toggleVersionData && el.version === version) ? style.activeP : style.defaultP}
              >
                {version}{downloads.find(el => el.type === toggleVersionData && el.version === version) ? " ✔" : ""}
              </p>
            ))
          }
        </nav>
      </section>
      <div className={style.statistic}>{`${chooseVersion.version} ${chooseVersion.type}`}</div>
      <button
        onClick={playing}
        style={{ color: downloads.find(el => el.type === chooseVersion.type && el.version === chooseVersion.version) ? "#07de2a" : "" }}
        className={style.game}
      >
        {buttonContent()}
      </button>
      {!downloads.find(el => el.type === chooseVersion.type && el.version === chooseVersion.version) && stateLoad &&
        <p className={style.loading}>
          <p style={{ width: `${(minecraftLoad * 100) / downloadMax}%` }} className={style.loading2}></p>
        </p>
      }
      <a href="https://t.me/KANTNOLI">KANTNOLI</a>
    </div>
  );
}

export default App;
