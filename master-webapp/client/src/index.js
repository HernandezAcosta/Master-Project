import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import Addition from "./contracts/Addition.json";
import MyStringStore from "./contracts/MyStringStore.json";
import PaperReviewHistory from "./contracts/PaperReviewHistory.json";

// let drizzle know what contracts we want
const options = { contracts: [Addition, MyStringStore, PaperReviewHistory] };
console.log("Index.js Call!");

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

// pass in the drizzle instance
ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
