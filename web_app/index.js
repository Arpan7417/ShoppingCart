import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import 'semantic-ui-css/semantic.min.css'
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { detailLoader, ScreenDetails } from "./ScreenDetails";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/",
  withCredentials:false
});

const client = new ApolloClient({
  httpLink,
  headers:{
    "content-type": "application/json",
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    "Access-Control-Allow-Credentials" : true,
    'Access-Control-Allow-Origin': "*",
    'X-Method-Used' : 'graphiql',
  },
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <BrowserRouter >
      <Routes>
      <Route
      path="/"
      element={<App></App>}
      ></Route>
      <Route path="details/:title" element={<ScreenDetails></ScreenDetails>} loader={detailLoader}> </Route>
      </Routes>
    </BrowserRouter>
  </ApolloProvider>
);
