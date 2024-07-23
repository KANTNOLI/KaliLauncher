import { useEffect, useState } from 'react';
import style from './App.module.scss';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const KEY = "KANTNOLI"
const KEY2 = "https://t.me/KANTNOLI"

function App() {
  //const launcher = new Client();
  const [toggleVersionData, setToggleVersionData] = useState("release")
  const toggleVersion = () => {
    setToggleVersionData(toggleVersionData === "release" ? "forge" : "release")
  }

  const [versionsDef, setVersionsDef] = useState([])
  const [versionsForge, setVersionsForge] = useState([])
  const [downloads, setDownloads] = useState([])


  const [chooseVersion, setChooseVersion] = useState({ version: "1.20.4", type: "release" })
  const handleChooseVersion = (version, type) => {
    setChooseVersion({ version: version, type: type })
    localStorage.setItem(KEY2, JSON.stringify({ version: version, type: type }))
  }

  //  localStorage.setItem(KEY, JSON.stringify([{ version: "1.20.4", type: "release" }]))
  //  localStorage.setItem(KEY2, JSON.stringify({version: "1.20.4", type: "release"}))



  useEffect(() => {
    socket.on('download', (data) => {
      console.log('Сообщение от сервера:', data);
    });

    if (localStorage.getItem(KEY)) {
      setDownloads(JSON.parse(localStorage.getItem(KEY)))
    }
    if (localStorage.getItem(KEY2)) {
      setChooseVersion(JSON.parse(localStorage.getItem(KEY2)))
    }

    fetch("https://mc-versions-api.net/api/java")
      .then((response) => response.json())
      .then((versions) => {
        setVersionsDef(versions.result)
      })
    fetch("https://mc-versions-api.net/api/forge")
      .then((response) => response.json())
      .then((versions) => {
        setVersionsForge(Object.keys(versions.result[0]))
      })
  }, [])


  const a = () => {
    socket.emit("message", JSON.stringify({
      username: "username",
      password: "password",
      root: "root",
      version: "version",
      type: "type",
      memoryMax: "memoryMax",
      memoryMin: "memoryMin"
    }));
  }


  console.log(chooseVersion);

  return (
    <div className={style.body}>
      <section className={style.panel}>
        <button onClick={() => toggleVersion()} className={style.toggleVer}>{toggleVersionData}</button>
        <nav className={style.nav}>
          {
            toggleVersionData === "release" ?
              versionsDef &&
              versionsDef.map((version, id) => (
                <p key={id}
                  onClick={() => handleChooseVersion(version, toggleVersionData)}
                  className={downloads.find((el) => el.type === toggleVersionData && el.version === version) ? style.activeP : style.defaultP}>{version}{downloads.find((el) => el.type === toggleVersionData && el.version === version) ? "✔" : ""}</p>
              )) : versionsForge &&
              versionsForge.map((version, id) => (
                <p key={id}
                  onClick={() => handleChooseVersion(version, toggleVersionData)}
                  className={downloads.find((el) => el.type === toggleVersionData && el.version === version) ? style.activeP : style.defaultP}
                >{version}{downloads.find((el) => el.type === toggleVersionData && el.version === version) ? " ✔" : ""}</p>
              ))
          }
        </nav>
      </section>
      <div className={style.statistic}>{`${chooseVersion.version}  ${chooseVersion.type}`}</div>

      <button onClick={() => a()} style={{ color: downloads.find((el) => el.type === chooseVersion.type && el.version === chooseVersion.version) ? "#07de2a" : "" }} className={style.game}>{downloads.find((el) => el.type === chooseVersion.type && el.version === chooseVersion.version) ? "Играть" : "Загрузить"}</button>
      {downloads.find((el) => el.type === chooseVersion.type && el.version === chooseVersion.version) ? "" :
        <p className={style.loading}><p className={style.loading2}></p></p>}


      <a href="https://t.me/KANTNOLI">KANTNOLI</a>
    </div>
  );
}

export default App;
