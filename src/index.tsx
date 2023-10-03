import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

/* const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
); 

 root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); */

const domContainer = document.querySelector("#constructor_app");
if (domContainer) {
  const root = ReactDOM.createRoot(domContainer);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// const jsonData = '{"ID":"46","IBLOCK_ID":"5","NAME":"Цвет стандартный","ACTIVE":"Y","SORT":"7","CODE":"STANDART_COLOR","DEFAULT_VALUE":"","PROPERTY_TYPE":"E","ROW_COUNT":"1","COL_COUNT":"30","LIST_TYPE":"L","MULTIPLE":"N","XML_ID":null,"FILE_TYPE":"","MULTIPLE_CNT":"5","LINK_IBLOCK_ID":"7","WITH_DESCRIPTION":"N","SEARCHABLE":"N","FILTRABLE":"N","IS_REQUIRED":"N","VERSION":"1","USER_TYPE":"EList","USER_TYPE_SETTINGS":{"size":1,"width":0,"group":"N","multiple":"N"},"HINT":"","~NAME":"Цвет стандартный","~DEFAULT_VALUE":"","VALUE_ENUM":null,"VALUE_XML_ID":null,"VALUE_SORT":null,"VALUE":"","PROPERTY_VALUE_ID":null,"DESCRIPTION":"","~DESCRIPTION":"","~VALUE":""}';
// console.log(JSON.parse(jsonData));

console.log("==>> V 0.27");

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
