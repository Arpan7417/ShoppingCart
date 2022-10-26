import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, Form, Icon } from "semantic-ui-react";

export const detailLoader = ({ params }) => params.title;
export const ScreenDetails = () => {
  const NAME_TAG = "name";
  const PRICE_TAG = "price";
  const NODE_GRAPHQL_SERVER_PATH = "http://localhost:4000/";
  const imgPath =
    "https://xcdn.next.co.uk/COMMON/Items/Default/Default/Publications/G55/shotview/190/T40-854s.jpg";
  const [viewOnEdit, setViewOnEdit] = useState(true);
  const [nameInputState, setNameInput] = useState();
  const [priceInputState, setPriceInput] = useState();
  const [productObj, setProductDetails] = useState({
    name: "Product 1",
    image: imgPath,
    price: "$300",
    id: "1",
  });

  const location = useLocation();

  useEffect(() => {
    //console.log('=> ',location.state);
    const productState = location.state;
    setProductDetails({
      name: productState.pName,
      id: productState.pId,
      image: productState.pImage,
      price: productState.pPrice,
    });
  }, []);

  const editIconView = (
    <div>
      <a
        onClick={() => {
          deleteStoreProduct(nameInputState, priceInputState, productObj.id);
        }}
      >
        <Icon name="delete"></Icon>
      </a>
      <a
        onClick={() => {
          viewOnEdit ? setViewOnEdit(false) : setViewOnEdit(true);
        }}
      >
        <Icon name="edit"></Icon>
      </a>
    </div>
  );

  const goBackFunc = () => {
    setViewOnEdit(true);
  };

  const submitFormForUpdate = () => {
    setViewOnEdit(true);
    updateStoreNow(nameInputState, priceInputState, productObj.id);
  };

  const inputValue = (attrType, value) => {
    if (attrType === NAME_TAG) {
      setNameInput(value);
    } else {
      value.includes("$") ? setPriceInput(value) : setPriceInput("$" + value);
    }
  };

  async function deleteStoreProduct(pName, pPrice, pId) {
    //console.log(pName, pPrice, pId);
    const variables = {
      name: pName,
      price: pPrice,
      id: pId,
    };
    const query = `
          mutation deleteStore($name : String,$price : String,$id : String){
            deleteStore(name: $name,price:$price, id : $id){
                id,
                name,
                price,
                image,
            }
          }`;
    const response = await fetch(NODE_GRAPHQL_SERVER_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    const responseData = await response.json();
    //console.log("response -> ", response);
    //console.log("response", responseData);
  }

  async function updateStoreNow(pName, pPrice, pId) {
    //console.log(pName, pPrice, pId);
    const variables = {
      name: pName,
      price: pPrice,
      id: pId,
    };
    const query = `
              mutation updateStore($name : String,$price : String,$id : String){
                updateStore(name: $name,price:$price, id : $id){
                    id,
                    name,
                    price,
                    image,
                }
              }`;
    const response = await fetch(NODE_GRAPHQL_SERVER_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    //console.log("response -> ", response);
    const responseData = await response.json();

    setProductDetails({
      name: nameInputState,
      price: priceInputState,
      image: productObj.image,
      id: productObj.id,
    });

    console.log("response", responseData);
  }

  const mutationForm = () => (
    <Form>
      <Form.Field>
        <label>Product Name</label>
        <input
          placeholder="Product Name"
          onChange={(e) => {
            inputValue(NAME_TAG, e.target.value);
          }}
        />
      </Form.Field>
      <Form.Field>
        <label>Product price</label>
        <input
          placeholder="Product price in $"
          onChange={(e) => {
            inputValue(PRICE_TAG, e.target.value);
          }}
        />
      </Form.Field>
      <Form.Field> </Form.Field>
      <Button
        type="submit"
        onClick={() => {
          submitFormForUpdate();
        }}
      >
        Submit
      </Button>
      <Button
        type="submit"
        onClick={() => {
          goBackFunc();
        }}
      >
        GoBack
      </Button>
    </Form>
  );

  return (
    <div style={{ padding: 20 }}>
      {viewOnEdit ? (
        <Card
          image={productObj.image}
          header={productObj.name}
          meta=""
          description={productObj.price}
          extra={editIconView}
        />
      ) : (
        <div> {mutationForm()} </div>
      )}{" "}
    </div>
  );
};
