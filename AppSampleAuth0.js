import React, { useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Auth0 from 'react-native-auth0';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from "jwt-decode";

var credentials = require('./auth0-configuration');
const auth0 = new Auth0({ domain: 'dev-haqt-0da.auth0.com', clientId: 'xm0rhxbCUFplWFuhMyEP3O8EpSwNaG2o' });
//const auth0 = new Auth0(credentials);

function App() {
    
        const [accessToken, setAccessToken]= useState(null);
        const [name, setName]= useState(null);

    function onLogin(){
        auth0.webAuth
            .authorize({
                scope: 'openid profile email offline_access',
            })
            .then(credentials => {
                if (Platform.OS !== 'web') {
                    // store session in storage and redirect back to the app
                const encodedToken = credentials.idToken;
                const decodedToken = jwtDecode(encodedToken);
                //console.log(decodedToken, "here is ec");
                console.log(encodedToken, "here is token");
                SecureStore.setItemAsync(
                    // AsyncStorage.setItem(
                    'MySecureAuthStateKey',
                    //JSON.stringify(decodedToken)
                    JSON.stringify({
                        token: encodedToken,
                        name: decodedToken.nickname,
                        id: decodedToken.sub,
                        exp: decodedToken.exp,
                        email: decodedToken.email,
                        avatar: decodedToken.picture
                    })
                ).then(() => {
                    alert('token saved locally');
                });
            }
                Alert.alert('AccessToken: ' + credentials.accessToken);

                Alert.alert('idToken: ' + credentials.idToken);
                const encodedToken = credentials.idToken;
                const decodedToken = jwtDecode(encodedToken);

                console.log('AccessToken: ' + credentials.accessToken);
                console.log(decodedToken, "here is ec");

                    //setToken(encodedToken);
                    setAccessToken(credentials.accessToken);
                    setName(decodedToken.nickname);
            })
            .catch(error => console.log(error));
    }

    const onLogout = () => {
        auth0.webAuth
            .clearSession({})
            .then(success => {
                Alert.alert('Logged out!');
                setAaccessToken(null);
            })
            .catch(error => {
                console.log('Log out cancelled');
            });
    }

        let loggedIn = accessToken === null ? false : true;
        return (
        <View style = { styles.container }>
            <Text style = { styles.header }> Auth0Sample - Login </Text>
            <Text>
                You are { loggedIn ? name : 'not logged in ' } . </Text>
                 <TouchableOpacity onPress={()=> loggedIn ? onLogout() : onLogin() }>
                    <Text
                    style ={{backgroundColor:'orange', marginTop:10}}
                    > { loggedIn ? 'Log Out' : 'Log In' }</Text>
                </TouchableOpacity> 
                {/*  <Button style ={{marginTop:10}}
                 onPress = {()=> loggedIn ? onLogout() : onLogin() } 
                title = { loggedIn ? 'Log Out' : 'Log In' }/> */}
        </View >
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
});

export default App;