import React, {useEffect} from "react";
import './styles/app.scss';
import Toolbar from "./components/Toolbar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <div className="app">
              <Routes>
                  <Route path="/" element={<Navigate to={`f${(+new Date).toString(16)}`} />} />
                  <Route path='/:id' element={
                      <>
                          <Toolbar/>
                          <SettingBar/>
                          <Canvas/>
                      </>
                  }/>
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;
