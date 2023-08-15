import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listRestaurants } from "./graphql/queries";
import {
  createRestaurant as createRestaurantMutation,
  deleteRestaurant as deleteRestaurantMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
  const [rests, setRests] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    const apiData = await API.graphql({ query: listRestaurants });
    const restsFromAPI = apiData.data.listRestaurants.items;
    setRests(restsFromAPI);
  }

  async function createRestaurant(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      state: form.get("state")
    };
    await API.graphql({
      query: createRestaurantMutation,
      variables: { input: data },
    });
    fetchRestaurants();
    event.target.reset();
  }

  async function deleteRestaurant({ id }) {
    const newRestaurants = rests.filter((rest) => rest.id !== id);
    setRests(newRestaurants);
    await API.graphql({
      query: deleteRestaurantMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Heading level={1}>Restaurants App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createRestaurant}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Restaurant Name"
            label="Restaurant Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Restaurant Description"
            label="Restaurant Description"
            labelHidden
            variation="quiet"
            required
          />
           <TextField
            name="state"
            placeholder="Restaurant Address"
            label="Restaurants Address"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Restaurant
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Restaurants List</Heading>
      <View margin="3rem 0">
        <table className="restaurant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rests.map((rest) => (
              <tr key={rest.id || rest.name}>
                <td>{rest.name}</td>
                <td>{rest.description}</td>
                <td>{rest.state}</td>
                <td>
                  <Button variation="link" onClick={() => deleteRestaurant(rest)}>
                    Delete Restaurant
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);