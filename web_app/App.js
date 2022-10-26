import "./App.css";
import { useEffect, useState } from "react";
import { Card } from "semantic-ui-react";
import { Link } from "react-router-dom";

const GET_LISTINGS_ALT = `
  query getStore {
    store {
      id
      name
      price
      image
    }
  }
`;

const LOCALHOST_PATH = "http://localhost:4000/";
const METHOD = "POST";
const headersObj = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Origin": "*",
  "X-Method-Used": "graphiql",
};

const App = () => {

  const [dataFromApi, setApiData] = useState();

  // Item rendered from this function
  const screenItem = ({ title, price, image, id }) => {
    return (
      <div style={{ padding: 20 }}>
        <Link to={`/details/${title}`} state={{pName:title,pPrice:price,pImage:image,pId : id}} ><Card image={image} header={title} meta="" description={price} /></Link>
      </div>
    );
  };

  /**
   * Get Data from api 
   */
  const getDataFromApi = async () => {
    const resultData = await fetch(LOCALHOST_PATH, {
      method: METHOD,
      headers: headersObj,
      body: JSON.stringify({ query: GET_LISTINGS_ALT }),
    });

    const jsonData = await resultData.json();
    //console.log("result ", jsonData);
    setApiData(jsonData.data.store);
  };

  /**
   * This is the one time call for the data fetch on load of this page
   */
  useEffect(() => {
    getDataFromApi();
  }, []);

  return (
    <div className="App">
      <div style={{backgroundColor:'#e2e2e2'}}>
        {dataFromApi?.map((obj) => (
          <div key={obj.id}>
            {screenItem({
              title: obj.name,
              price: obj.price,
              image: obj.image,
              id: obj.id
            })}
          </div>
        ))}
      </div>
    </div>
  );
};


export default App;
