import 'react-native-gesture-handler';
import React, { useState, useEffect, createContext } from "react";
import { Alert, Button, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Buffer } from 'buffer';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useTheme, 
  Avatar, 
  DarkTheme as PaperDarkTheme, 
  DefaultTheme as PaperDefaultTheme, 
  Provider as PaperProvider, 
  Title, 
  Caption, 
  Paragraph, 
  Drawer,
  Text, 
  TouchableRipple, 
  Switch} from 'react-native-paper';
//import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import createApolloClient from './pages/apollo';
import AsyncStorage from '@react-native-community/async-storage';
import * as SecureStore from 'expo-secure-store';
import { ApolloProvider as LegacyApolloProvider, Query } from 'react-apollo';
import * as Font from 'expo-font';
import Icon from '@expo/vector-icons/FontAwesome5';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Auth0 from 'react-native-auth0';
import jwtDecode from 'jwt-decode';


import Home from './pages/Home/Home';
import Depart from './pages/Home/Depart';
import Admin from './pages/Home/Admin';
import AddPOS from './pages/Home/AddPOS';
import AddTransaction from './pages/Home/AddTransaction';
import Accounts from './pages/Accounts/Accounts';
import AddAccount from './pages/Accounts/AddAccount';
import EditAccount from './pages/Accounts/EditAccount';
import AddCashFlow from './pages/CashFlows/AddCashFlow';
import EditCashFlow from './pages/CashFlows/EditCashFlow';
import Settings from './pages/Settings/Settings';
import AddProfile from './pages/Settings/AddProfile';
import UserProfile from './pages/ProfileStack.js/UserProfile';
import EditProfile from './pages/Settings/EditProfile';
import AddCompany from './pages/Settings/AddCompany';
import EditCompany from './pages/Settings/EditCompany';
import ViewCompany from './pages/Settings/ViewCompany';
import AddUsers from './pages/Settings/AddUsers';
import ViewUsers from './pages/Settings/ViewUsers';
import Reports from './pages/Reports/Reports';
import Stock from './pages/Stock/Stock';
import StockList from './pages/Stock/StockList';
import EditProduct from './pages/Stock/EditProduct';
import AddProduct from './pages/Stock/AddProduct';
import FirstStack from './pages/Home/FirstStack';
import SecondStack from './pages/Accounts/SecondStack';
import CashFlows from './pages/CashFlows/CashFlows';
import HomeTab from './pages/TabOneStack1/HomeTab';
import Cart from './pages/TabOneStack1/Cart';
import ProductPage from './pages/TabOneStack1/ProductPage';
import Products from './pages/TabOneStack1/Products';
import CustomSidebarMenu from './pages/CustomDrawer';
import LoginScreen from './pages/Login';
import MyOrders from './pages/TabOneStack2/MyOrders';
import Order from './pages/TabOneStack2/Order';
import OrderItem from './pages/TabOneStack2/OrderItem';
import OrdersOrgItem from './pages/Orders/OrdersOrgItem';
import OrdersOrg from './pages/Orders/OrdersOrg';
import AllOrders from './pages/Orders/AllOrders';
import Login from './pages/Login';

var credentials = require('./auth0-configuration');
global.Buffer = Buffer;

const Stack = createStackNavigator();
const DrawerNav = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export const UserContext = createContext();
let customFonts = {
  'ValidityScriptBI': require('./assets/fonts/ValidityScriptBI.ttf'),
  'YellowRabbit': require('./assets/fonts/YellowRabbit.otf'),
  'LovingYou': require('./assets/fonts/LovingYou.otf'),
  'maven-pro-bold': require('./assets/fonts/MavenPro-Bold.ttf'),
  'maven-pro-regular': require('./assets/fonts/MavenPro-Regular.ttf'),
};



const NavigationDrawerStructure = (props)=> {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={()=> toggleDrawer()}>
        {/*Donute Button Image */}
        <Image
          source={require('./images/drawerWhite.png')}
          style={{ width: 25, height: 25, marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
}
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [token, setToken] = useState(null);
  const [dept_id, setDept_id] = useState(null);
  const [org_id, setOrg_id] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const [role, setRole] = useState(null);
  const [phone, setPhone] = useState(null);
  const [logo, setLogo] = useState(null);
  const [cart, setCart] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [cashflow, setCashflow] = useState({ todos: [] });
  const [myAccounts, setMyAccounts] = useState({ accountsCash: [] });
  const linking ={
    prefixes:['com.micent://']
  }
  let loggedIn = token === null ? false : true;
 
  const CombinedDarkTheme={
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
  }
  const CombinedDefaultTheme={
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme    
  }
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const theme =isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;

function CustomDrawerContent(props){
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props}>
        <DrawerItem //label="help"
        onPress={()=> alert('link to help')}/>
      </DrawerItemList>
    </DrawerContentScrollView>
  )
} 
function DrawerContent(props,navigation){
  const paperTheme = useTheme();
  return (
    <DrawerContentScrollView {...props}>
      <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:100}}>
        <Text>Draw content</Text>
        
      </View>
      {/* <DrawerNav.Navigator
      drawerPosition="left"
      drawerType='slide'
      drawerContent={() => <DrawerContent/>}
        drawerContentOptions={{
          activeTintColor: '#e91e63',

         // itemStyle: { marginVertical: 5 },
        }}> 
        <DrawerNav.Screen
          name="FirstPage"
          options={{ drawerLabel: 'Shopping' }}
          //component={TabStack} 
          component={firstScreenStack} 
          />
        <DrawerNav.Screen
          name="SecondPage"
          options={{ drawerLabel: 'My Orders' }}
          component={secondScreenStack} />
       </DrawerNav.Navigator> */}
      <DrawerItem label="help"
        onPress={()=>{}} {...props}/>
        <TouchableRipple onPress={()=>{}}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                  <View pointerEvents="none">
                    <Switch value={theme.dark}/>
                  </View>
              </View>
            </TouchableRipple>
      {/* <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image 
            source={{uri:avatar}}
            size={120}
          />
          <Title style={styles.title}>{username}</Title>
          <Caption style={styles.caption}>{email}</Caption>
          <Caption style={styles.caption}>{role}</Caption>
          <View style={styles.row}>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>156</Paragraph>
            <Caption style={styles.caption}>followers</Caption>
          </View>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>156</Paragraph>
            <Caption style={styles.caption}>followers</Caption>
          </View>
        </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
         
           <DrawerItem
           label="profile"
          icon={({color, size})=>(
            <MaterialCommunityIcons
            name="account-outline"
            color={color}
            size={size}
            onPress={()=>{}}
            />
          )} 
          />
          <DrawerItem
            label="preferences"
          icon={({color, size})=>(
            <MaterialCommunityIcons
            name="tune"
            color={color}
            size={size}
            onPress={()=>{props.navigation.push('Reports')}}
            />
          )}
          />
          <DrawerItem
            label="Bookmarks"
          icon={({color, size})=>( 
            <MaterialCommunityIcons
            name="book-outline"
            color={color}
            size={size}
            onPress={()=>{firstScreenStack}}
            />
          )}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
            <TouchableRipple onPress={()=>toggleTheme()}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                  <View pointerEvents="none">
                    <Switch value={theme.dark}/>
                  </View>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={()=>{}}>
              <View style={styles.preference}>
                <Text>RTL </Text>
                  <View pointerEvents="none">
                    <Switch value={false} onValueChange={()=> onLogout()}/>
                  </View>
              </View>
            </TouchableRipple>
        </Drawer.Section>
        </View>
     */}</DrawerContentScrollView>
  )
} 


function profileStackFlow_StackNavigator ({ navigation }){
    //All the screen from the Screen3 will be indexed here
    return(
    <Stack.Navigator initialRouteName="UserProfile">
        <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          title: 'My Profile', //Set Header Title
          headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
          headerStyle: {
            backgroundColor: '#f4511e', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
        />
         
    </Stack.Navigator>
  );
}
function reports_StackNavigator({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="Reports">
        <Stack.Screen
          name="Reports"
          component={Reports}
          options={{
            title: 'Reports', //Set Header Title
            headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
              backgroundColor: '#f4511e', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        
      </Stack.Navigator>
  );
}

function accounts_StackNavigator({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="Accounts">
        <Stack.Screen
          name="Accounts"
          component={Accounts}
          options={{
            title: 'Accounts', //Set Header Title
            headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
              backgroundColor: '#f4511e', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="EditAccount"
          component={EditAccount}/>
        <Stack.Screen
          name="AddAccount"
          component={AddAccount}/>
      </Stack.Navigator>
  );
}

function admin_StackNavigator({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="Admin">
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{
            title: 'Admin', //Set Header Title
            headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
              backgroundColor: '#f4511e', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="AddPOS"
          component={AddPOS}/>
        <Stack.Screen
          name="AddTransaction"
          component={AddTransaction}/>
      </Stack.Navigator>
  );
}

function depart_StackNavigator({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="Depart">
        <Stack.Screen
          name="Depart"
          component={Depart}
          options={{
            title: 'Depart', //Set Header Title
            headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
              backgroundColor: '#f4511e', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="AddPOS"
          component={AddPOS}/>
        <Stack.Screen
          name="FirstStack"
          component={FirstStack}/>
        <Stack.Screen
          name="AddTransaction"
          component={AddTransaction}/>
      </Stack.Navigator>
  );
}


function home_StackNavigator({ navigation, route }) {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
           
            title: 'Home', //Set Header Title,
            headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
              backgroundColor: '#f4511e', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="AddPOS"
          component={AddPOS}
          />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransaction}/>
      </Stack.Navigator>
  );
}

  //Drawer Options and indexing
  function drawerNavigatorDepart({navigation}){
      return (
          <DrawerNav.Navigator
            drawerContentOptions={{
              activeTintColor: '#e91e63',
              itemStyle: { marginVertical: 5 },
            }}>
            <DrawerNav.Screen
              name="Home"
              options={{ 
                drawerLabel: 'Home',
              drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
              name={focused ? 'home' : 'home'} />, }}
                
              component={depart_StackNavigator} />
               <DrawerNav.Screen
              name="Accounts"
              options={{ drawerLabel: 'Accounts' }}
               /*  drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
             name={focused ? 'cash-register' : 'cash-register'} />, */
              component={accounts_StackNavigator} />
            <DrawerNav.Screen
              name="CashFlows"
              options={{ drawerLabel: 'CashFlows' }}
               /* drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
            name={focused ? 'columns' : 'book'} />, */
              component={cashFlows_StackNavigator} />
               <DrawerNav.Screen
              name="Stock"
              options={{ drawerLabel: 'Stock' }}
                /*  drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
             name={focused ? 'folder' : 'folder-open'} />, */
              component={stock_StackNavigator} />
               <DrawerNav.Screen
              name="Reports"
              options={{ drawerLabel: 'Reports' }}
               /* drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
            name={focused ? 'chart-area' : 'chart-bar'} />, */
              component={reports_StackNavigator} />
              <DrawerNav.Screen
              name="Settings"
              options={{ drawerLabel: 'Settings' }}
              //component={TabStack} 
              /*  drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
             name={focused ? 'toolbox' : 'tools'} />, */
              component={setting_StackNavigator} 
              />
          </DrawerNav.Navigator>
      );
  }
function drawerNavigatorAdmin({navigation}){
  return (
      <DrawerNav.Navigator
        drawerContentOptions={{
          activeTintColor: '#e91e63',
          itemStyle: { marginVertical: 5 },
        }}>
        <DrawerNav.Screen
          name="Home"
          options={{ drawerLabel: 'Home' }}
           /*  drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'home' : 'home'} />, */
          component={admin_StackNavigator} />
           <DrawerNav.Screen
          name="Accounts"
          options={{ drawerLabel: 'Accounts' }}
           /*  drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'cash-register' : 'cash-register'} />, */
          component={accounts_StackNavigator} />
        <DrawerNav.Screen
          name="CashFlows"
          options={{ drawerLabel: 'CashFlows' }}
           /* drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
        name={focused ? 'columns' : 'book'} />, */
          component={cashFlows_StackNavigator} />
           <DrawerNav.Screen
          name="Stock"
          options={{ drawerLabel: 'Stock' }}
            /*  drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'folder' : 'folder-open'} />, */
          component={stock_StackNavigator} />
           <DrawerNav.Screen
          name="Reports"
          options={{ drawerLabel: 'Reports' }}
           /* drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
        name={focused ? 'chart-area' : 'chart-bar'} />, */
          component={reports_StackNavigator} />
          <DrawerNav.Screen
          name="Settings"
          options={{ drawerLabel: 'Settings' }}
          //component={TabStack} 
          /*  drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'toolbox' : 'tools'} />, */
          component={setting_StackNavigator} 
          />
      </DrawerNav.Navigator>
  );
}
function stock_StackNavigator({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="Stock">
        <Stack.Screen
          name="Stock"
          component={Stock}
          options={{
            title: 'Stock', //Set Header Title
            headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
              backgroundColor: '#f4511e', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
         <Stack.Screen
          name="AddProduct"
          component={AddProduct}
          />
         <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          />
        
      </Stack.Navigator>
  );
}
function cashFlows_StackNavigator({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="CashFlows">
        <Stack.Screen
          name="CashFlows"
          component={CashFlows}
          options={{
            title: 'CashFlows', //Set Header Title
            headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
              backgroundColor: '#f4511e', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
         <Stack.Screen
          name="EditCashFlow"
          component={EditCashFlow}
          />
         <Stack.Screen
          name="AddCashFlow"
          component={AddCashFlow}
          />
        
      </Stack.Navigator>
  );
}
function setting_StackNavigator ({ navigation }){
    //All the screen from the Screen3 will be indexed here
    return(
    <Stack.Navigator initialRouteName="Settings">
        <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings', //Set Header Title
          headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
          headerStyle: {
            backgroundColor: '#f4511e', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
        />
         <Stack.Screen
        name="AddCompany"
        component={AddCompany}
        />
         <Stack.Screen
        name="EditCompany"
        component={EditCompany}
        />
         <Stack.Screen
        name="ViewCompany"
        component={ViewCompany}
        />
        <Stack.Screen
        name="ViewUsers"
        component={ViewUsers}
        />
        <Stack.Screen
        name="AddUser"
        component={AddUsers}
        />
         <Stack.Screen
        name="AddProfile"
        component={AddProfile}
        />
        <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        />
        <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        />
    </Stack.Navigator>
  );
}
function firstScreenStack({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="HomeTab">
        <Stack.Screen
          name="HomeTab"
          component={HomeTab}
         
          options={{
            //title: 'First Page', //Set Header Title
            headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
            headerStyle: {
              backgroundColor: '#f4511e', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
         <Stack.Screen
          name="Cart"
          component={Cart}
         />
         <Stack.Screen
          name="ProductPage"
          component={ProductPage}
         />
         <Stack.Screen
          name="Products"
          component={Products}
         />
      </Stack.Navigator>
  );
}

function secondScreenStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="MyOrders"
     >
        
      <Stack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{
          headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
          headerStyle: {
            backgroundColor: '#f4511e', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          }
        }}/>
         <Stack.Screen
        name="OrderItem"
        component={OrderItem}
        />
        <Stack.Screen
        name="Order"
        component={Order}/>
     
    </Stack.Navigator>
  );
}
function ordersOrgScreenStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="OrdersOrg"
     >
        
      <Stack.Screen
        name="OrdersOrg"
        component={OrdersOrg}
        options={{
          headerLeft: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
          headerStyle: {
            backgroundColor: '#f4511e', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          }
        }}/>
         <Stack.Screen
        name="OrdersOrgItem"
        component={OrdersOrgItem}
        />
        <Stack.Screen
        name="AllOrders"
        component={AllOrders}
        />
     
     
    </Stack.Navigator>
  );
}
function drawerNavigatorExample({navigation, route}){
  //navigation.setOptions({tabBarVisible:false})
  /* if(navigation.route.state?.index >= 0 ){
    navigation.setOptions({tabBarVisible:true})
  }else{
    navigation.setOptions({tabBarVisible:false})
  } */
 //navigation.setOptions({tabBarVisible:false})
  return (
      <DrawerNav.Navigator
      drawerPosition="right"
      drawerType='slide'
        drawerContentOptions={{
          activeTintColor: '#e91e63',
          itemStyle: { marginVertical: 5 },
        }}>
        <DrawerNav.Screen
          name="Home"
         
          options={{ 
            drawerLabel: 'Home',
          drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'home' : 'home'} />, 
         }}
           
          component={home_StackNavigator} />
          <DrawerNav.Screen 
          name="Orders"
          component={ordersOrgScreenStack}
          options={{ 
            drawerLabel: 'Orders',
          drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'spider' : 'ship'} />}}
          />
           <DrawerNav.Screen
          name="Accounts"
          options={{ 
          drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'cash-register' : 'cash-register'} />, 
            drawerLabel: 'Accounts' }}
          
          component={accounts_StackNavigator} />
        <DrawerNav.Screen
          name="CashFlows"
          options={{ 
          drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
        name={focused ? 'columns' : 'book'} />,
            drawerLabel: 'CashFlows' }}
           
          component={cashFlows_StackNavigator} />
           <DrawerNav.Screen
          name="Stock"
          options={{ 
        drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'folder' : 'folder-open'} />,
            drawerLabel: 'Stock' }}
           
          component={stock_StackNavigator} />
           <DrawerNav.Screen
          name="Reports"
          options={{ 
           drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
        name={focused ? 'chart-area' : 'chart-area'} />,
            drawerLabel: 'Reports' }}
           
          component={reports_StackNavigator} />
          <DrawerNav.Screen
          name="Settings"
          options={{ 
             drawerIcon: ({ focused, color, size }) => <Icon color={focused ? 'brown' : 'purple'} size={25}
         name={focused ? 'tools' : 'tools'} />, 
            drawerLabel: 'Settings' }}
          //component={TabStack} 
         
          component={setting_StackNavigator} 
          />
      </DrawerNav.Navigator>
  );
}

function DrawerStack(navigation, route,props) {
  return (
      <DrawerNav.Navigator
      drawerPosition="left"
      drawerType='slide'
      drawerContent={(props) => <DrawerContentScrollView {...props}>
      <DrawerItemList {...props}>
        <DrawerItem //label="help"
        onPress={()=> alert('link to help')}/>
      </DrawerItemList>
      
              <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image 
            source={{uri:avatar}}
            size={120}
          />
          <Title style={styles.title}>{username}</Title>
          <Caption style={styles.caption}>{email}</Caption>
          <Caption style={styles.caption}>{role}</Caption>
          <View style={styles.row}>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>Tel:</Paragraph>
            <Caption style={styles.caption}>{phone}</Caption>
          </View>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>@</Paragraph>
            <Caption style={styles.caption}>{orgName}</Caption>
          </View>
        </View>
        </View>
        
        <Drawer.Section title="Preferences">
            <TouchableRipple onPress={()=>toggleTheme()}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                  <View pointerEvents="none">
                    <Switch value={theme.dark}/>
                  </View>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress = {()=> loggedIn ? onLogout() : onLogin() }>
              <View style={styles.preference}>
                
                 { loggedIn ? <Text>Logout</Text> : <Text>Login</Text> }
              </View>
            </TouchableRipple>
        </Drawer.Section>
        <Drawer.Section title=" ">
        <View style={[{
    marginTop:10,
    flexDirection:'row',
    alignItems:'center', marginLeft:20,fontSize:26,
  }]}>
          <View >
            <Text style={{color:'red'}}>H</Text>
            </View>  
            <View>
            
            </View><Text style={{color:'blue'}}>o</Text>
            <View>
            <Text style={{color:'yeast'}}>r</Text>
            </View>
            <View>
            <Text style={{color:'gray'}}>e</Text>
            </View>
            <View>
            <Text style={{color:'teal'}}>l</Text>
            </View> 
            <View>
            <Text style={{color:'red'}}>o</Text>
            </View>
            <View>
            <Caption>.Inc</Caption>
            </View>
          </View>
         {/*  <View>
          <Caption style={styles.caption}>@ftp: FingerTipPower</Caption>
            <Text>Let's Share The fun Together</Text>
          </View> */}
        </Drawer.Section>
        </View>
    </DrawerContentScrollView>}
        drawerContentOptions={{
          activeTintColor: '#e91e63',

          itemStyle: { marginVertical: 5, },
        }}>
          
        <DrawerNav.Screen
          name="Shopping"
          options={{ 
          drawerIcon: () => <Icon color={'purple'} size={25}
          name={'water'} />,
          drawerLabel: 'Shopping' }}
          //component={TabStack} 
          component={firstScreenStack} 
          />
          
        <DrawerNav.Screen
          name="MYOrders"
          options={{ 
            drawerIcon: () => <Icon color={'purple'} size={25}
         name={'horse'} />,
             drawerLabel: 'My Orders' }}
          component={secondScreenStack} />
          <DrawerNav.Screen
          name="Profile"
          options={{ 
            drawerIcon: () => <Icon color={'purple'} size={25}
         name={'user-alt'} />,
             drawerLabel: 'Profile' }}
          component={profileStackFlow_StackNavigator} />
      </DrawerNav.Navigator>
  );
}


const getToken = async () => {
  try{
    let res = await SecureStore.getItemAsync('MySecureAuthStateKey');
    const detail = JSON.parse(res);
    const {token, id } = detail;
    //setEmail(email);
    //setUsername(name);
    setToken(token);
    setUserId(id);
    //setAvatar(avatar);
    const rol = await AsyncStorage.getItem('CurrentProfile');
    const profiles = JSON.parse(rol);
    const { username,
      avatar,
      orgID,
      deptID,
      role,
      phone,
      email,
      orgName,
      logo } = profiles;
     setOrg_id(orgID);
     setDept_id(deptID);
     setRole(role);
     setPhone(phone);
     setEmail(email);
     setUsername(username);
     setAvatar(avatar);
     setLogo(logo);
     setOrgName(orgName);
  }
  catch(e){
    //onLogin();
  }      
}
  React.useEffect(() => {
    // Stop the Splash Screen from being hidden.
    try{
      const rol = AsyncStorage.getItem('CurrentProfile');
      const profiles = JSON.parse(rol);
      const { username,
        avatar,
        orgID,
        deptID,
        role,
        phone,
        email,
        orgName,
        logo } = profiles;
       setOrg_id(orgID);
       setDept_id(deptID);
       setRole(role);
       setPhone(phone);
       setEmail(email);
       setUsername(username);
       setAvatar(avatar);
       setLogo(logo);
       setOrgName(orgName);
    }
    catch(e){
      //onLogin();
    }      
   getToken();
  }, []);
//const auth0 = new Auth0(credentials);
const auth0 = new Auth0({ domain: 'dev-haqt-0da.auth0.com', clientId: 'xm0rhxbCUFplWFuhMyEP3O8EpSwNaG2o', redirectUrl:'com.micent://' });
function onLogin(){
  try{
    auth0.webAuth
    .authorize({
        //scope: 'openid profile email offline_access',
        //redirectUrl:'com.micent://',
        scope: 'openid profile email offline_access',
    })
    .then(credentials => {
        if (Platform.OS !== 'web') {
            // store session in storage and redirect back to the app
        const encodedToken = credentials.idToken;
        const decodedToken = jwtDecode(encodedToken);
        setToken(encodedToken);
        userDetails();
        //console.log(decodedToken, "here is ec");
        console.log(encodedToken, "here is token");
        SecureStore.setItemAsync(
            'MySecureAuthStateKey',
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
        const encodedToken = credentials.idToken;
        const decodedToken = jwtDecode(encodedToken);
            setAccessToken(credentials.accessToken);
            setName(decodedToken.nickname);
    })
    .catch(error => console.log(error));

  }
  catch(error){
    console.log(error)
  }
  }

const onLogout = () => {
  auth0.webAuth
      .clearSession({})
      .then(success => {
          Alert.alert('Logged out!');
          setToken(null);
          
          try {
            //SecureStore.deleteItemAsync('MySecureAuthStateKey');
            //AsyncStorage.removeItem('CurrentProfile');
            AsyncStorage.removeItem('priceList');
            AsyncStorage.removeItem('cashflows');
            AsyncStorage.removeItem('accounts');
            loggedIn=false;
          } catch (error) {
            console.log(error);
          }
      })
      .catch(error => {
          console.log('Log out cancelled');
      });
}
  const apolloClient = createApolloClient(token);
  const userDetails = async () => {
    await apolloClient.query({
      query: gql `
    query {
      users {
        name
        email
        avatar
        org_id
        organizations{
          name
          logo
        }
        dept
        role
        phone
      }
    }`
    }).then((result) => {
      setEmail(result.data.email);
      setUsername(result.data.name);
      setPhone(result.data.phone);
      setRole(result.data.role);
      setDept_id(result.data.dept);
      setAvatar(result.data.avatar);
      setOrg_id(result.data.org_id);
      setLogo(result.data.organizations.logo);
      setOrgName(result.data.organizations.name);
      console.log("graphql response", result);
      return result.data;
    }).catch((error) => {
      console.log("Graphql query error", error);
      let err = error;
      if (error.graphQlErrors && error.graphQlErrors.length > 0)
        err = error.graphQlErrors[0];
      throw err;
    });
  };
  useEffect(() => {
    const loadFontsAsync = async () => {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    };
    loadFontsAsync();
    setAppIsReady(true);
    getToken();
   
  }, [appIsReady]);


 

  function toggleTheme(){
    setIsDarkTheme(isDarkTheme => !isDarkTheme );
  }

 //userDetails()
  return (
    loggedIn ? 
    
      <UserContext.Provider value={{
        username, email, userId, token, dept_id, org_id, avatar, role, logo, orgName, phone, cart, setPhone, setCart,
        setOrgName, setLogo, setRole, setUsername, setEmail, setToken, setUserId, setDept_id, setOrg_id, setAvatar }}>
        <LegacyApolloProvider client={apolloClient}>
          <PaperProvider theme={theme}>
      <NavigationContainer linking={linking} theme={theme}>
      <Tab.Navigator
      initialRouteName="FirstPage"
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#F8F8F8',
        activeBackgroundColor:'teal',
        inactiveBackgroundColor:'#149',
        style: {
          backgroundColor: '#434',
        },
        keyboardHidesTabBar:true,
        labelStyle: {
          textAlign: 'center',
        },
        indicatorStyle: {
          borderBottomColor: '#87B56A',
          borderBottomWidth: 2,
        },
      }}>
      <Tab.Screen
        name="FirstPage"
        component={DrawerStack}
        options={{
          tabBarLabel: 'Community',
           tabBarIcon: ({ color, size }) => (
             <Icon name="palette" color={"#fff"} size={25} />
           ),
        }}  />
      
      <Tab.Screen
        name="SecondPage"
        component={drawerNavigatorExample}
         /* component={role !== null ? 
          (role ==='admin' ? 
          drawerNavigatorAdmin
          : 
          role ==='depart' ? 
          drawerNavigatorDepart
          : 
          drawerNavigatorExample
          )
          :
          <Text>null role</Text>}  */
        options={{
          tabBarLabel: 'Micents',
           tabBarIcon: ({ color, size }) => (
             <Icon name="hubspot" color={"#fff"} size={25} />
           ),
        }} />
    </Tab.Navigator>
      {/* <Stack.Navigator
          initialRouteName="Settings"
          screenOptions={{
            headerStyle: { backgroundColor: '#633689' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}> 
          
           <Stack.Screen name="TabStack" component={TabStack}/>
          </Stack.Navigator> */}
    </NavigationContainer>
    </PaperProvider>
    </LegacyApolloProvider>
      </UserContext.Provider>
      
      : 
      <View style = { styles.container }>
            <Text style = { styles.header }> Online - Login </Text>
            <Text>
                You are not logged in. </Text>
                 {/* <TouchableOpacity onPress={()=> loggedIn ? onLogout() : onLogin() }>
                    <Text
                    style ={{backgroundColor:'orange', marginTop:10}}
                    > { loggedIn ? 'Log Out' : 'Log In' }</Text>
                </TouchableOpacity>  */}
                  <Button style ={{marginTop:10}}
                 onPress = {()=> loggedIn ? onLogout() : onLogin() } 
                title = { loggedIn ? 'Log Out' : 'Log In' }/> 
        </View >
             );

}


function TabStack() {
  return (
    
      <Tab.Navigator
      initialRouteName="FirstPage"
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#F8F8F8',
        style: {
          backgroundColor: '#434',
        },
        labelStyle: {
          textAlign: 'center',
        },
        indicatorStyle: {
          borderBottomColor: '#87B56A',
          borderBottomWidth: 2,
        },
      }}>
      <Tab.Screen
        name="FirstPage"
        component={DrawerStack}
        options={{
          tabBarLabel: 'Home',
           tabBarIcon: ({ color, size }) => (
             <Icon name="home" color={"#fff"} size={25} />
           ),
        }}  />
      
      <Tab.Screen
        name="SecondPage"
        component={drawerNavigatorExample}
       /*  component={role !== null ? 
          (role ==='admin' ? 
          drawerNavigatorAdmin
          : 
          role ==='depart' ? 
          drawerNavigatorDepart
          : 
          drawerNavigatorExample
          )
          :
          <Text>null role</Text>} */
        options={{
          tabBarLabel: 'Setting',
           tabBarIcon: ({ color, size }) => (
             <Icon name="settings" color={"#fff"} size={25} />
           ),
        }} />
    </Tab.Navigator>
   
  );
}


/*
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Settings"
        screenOptions={{
          headerStyle: { backgroundColor: '#633689' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
        <Stack.Screen name="TabStack" component={TabStack} options={{ title: 'Tab Stack' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
  },
  header: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10
  },
  drawerContent:{
    flex:1,
  },
  userInfoSection:{
    paddingLeft: 20,
  },
  title:{
    marginTop:20,
    fontWeight:'bold',
  },
  caption:{
    fontSize:14,
    lineHeight:14,
  },
  row:{
    marginTop:20,
    flexDirection:'row',
    alignItems:'center',
  },
  section:{
    flexDirection:'row',
    alignItems:'center',
    marginRight:15,
  },
  paragraph:{
    fontWeight: 'bold',
    marginRight:3,
  },
  drawerSection:{
    marginTop:15,
  },
  preference:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingVertical: 12,
    paddingHorizontal:16,
  }
});


export default App;