import { useEffect, useState } from 'react';
import style from './App.module.scss';

const KEY = "KANTNOLI"
const KEY2 = "https://t.me/KANTNOLI"

function App() {
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

      <button className={style.game}>загрузить</button>
    </div>
  );
}

export default App;
