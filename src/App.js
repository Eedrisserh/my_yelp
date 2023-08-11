import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import {
  withAuthenticator,
  Button,
  Heading,
 
  View,
  Card,
} from "@aws-amplify/ui-react";

function App({ signOut }) {
  return (
    <View className="App">
      <Card>
        <img src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have a fully functional Authentication system! yeah?</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);