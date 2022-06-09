import React, { Component } from "react";
import "./App.css";
import Game from "./components/Game/Game";
import {maps} from "./TrackSource";

export const walls = maps[1].walls;
export const finish = maps[1].finish;
export const size_map = maps[1].size_map;

class App extends Component {
   render() {
      return (
         <div className="App">
            <Game/>
         </div>
      );
   }
}

export default App;
