const { ApolloServer, gql } = require('apollo-server');

//Graph Query typeDefs to fetch and update , delete data 
const typeDefs = gql`

  type Query{
    store:[Shop]
  }

  type Mutation {
    updateStore(name : String, price: String, id:String) : Shop,
    deleteStore(name : String, price: String, id:String) : Shop
  }

type Shop {
    id: String,
    name: String,
    available: String,
    price: String,
    image: String
}
`;

const store = [
  {
      "id":"1",
      "name":"firstname",
      "price":"$100",
      "available":"Yes",
      "image":"https://xcdn.next.co.uk/COMMON/Items/Default/Default/Publications/G55/shotview/190/T40-854s.jpg"
  },
  {
      "id":"2",
      "name":"secondname",
      "price":"$200",
      "available":"Yes",
      "image":"https://xcdn.next.co.uk/COMMON/Items/Default/Default/Publications/G55/shotview/190/T40-854s.jpg"
  },
  {
      "id":"3",
      "name":"thirdname",
      "price":"$300",
      "available":"Yes",
      "image":"https://xcdn.next.co.uk/COMMON/Items/Default/Default/Publications/G55/shotview/190/T40-854s.jpg"
  }
];
var pg = require('pg');
var conString = "postgresql://localhost:5432/demo";
var client = new pg.Client(conString);
client.connect();

const currentList = [];
client.query('SELECT * from SHOP_LISTING',(err,res) => {
  //console.log(err, res);
  res.rows.map((data,index) => {
      //console.log('row -> ',data);        
      currentList[index] = data;
  })
  client.end;
})


const fetchCurrentProducts = async () => {
  client.query('SELECT * from SHOP_LISTING',(err,res) => {
    //console.log(err, res);
    res.rows.map((data,index) => {
        console.log('row -> ',data);        
        currentList[index] = data;
    })
    client.end;
  })
}

const updateDataForProduct = async (lastestName,obj,id) => {
  const sqlQuery = 'UPDATE SHOP_LISTING SET name = $1::text , price = $2::text where id=$3::text '
  const result = await client.query(sqlQuery,[obj.name,obj.price,obj.id]);
  //console.log('update ',result.rows);
  fetchCurrentProducts();
  return result;
}

const deleteDataForProduct = async (obj1,obj2,obj3) => {
  const sqlQuery = 'DELETE FROM SHOP_LISTING where id=$1::text'
  const result = await client.query(sqlQuery,[obj2.id]);
  //console.log('update ',result);
  fetchCurrentProducts();
  return result;
}

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves items from the "Store" database.
const resolvers = {
  Query: {
    store: () => currentList
  },
  Mutation: {
    updateStore  (name,price,id)  {
      //console.log(name,price,id);
      return updateDataForProduct(name,price,id)
    },
    deleteStore  (name,price,id)   {
      //console.log('server id => ',price);
      return deleteDataForProduct(name,price,id)
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers , cors:{
  origin:'*'
}});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

