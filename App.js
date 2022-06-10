import md5 from 'md5';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AppRegistry } from 'react-native-web';

import Appbar from './components/appBar';
import VehiclesList from './components/vehiclesList';

var user = { user: "" }

export default function App() {

  const mainStyle = StyleSheet.create({
    root: {
      backgroundColor: '#000',
      width: '100%',
      height: '100%',
      alignItems: 'center'
    },
    screen: {
      backgroundColor: '#2b2d42',
      height: 800,
      width: 400,
      top: '7.5%'
    },
    button: {
      padding: 5,
      marginHorizontal: 7,
      backgroundColor: '#f0A0A0',
      width: 150,
      height: 30,
      left: 10
    }
  });

  const fields = StyleSheet.create({
    text: {
      fontWeight: 'bold',
      color: '#edf2f4',
      marginLeft: 17,
      marginVertical: 10
    },
    inputField: {
      backgroundColor: '#8d99ae',
      width: 250,
      marginLeft: 17,
      fontSize: 25
    }
  });

  const HOME_SCREEN = "login";
  const CREATE_ACCOUNT_SCREEN = "create-account";
  const SIGN_IN_SCREEN = "sign-in";
  const LISTING_SCREEN = "listing";
  const ADD_CAR_SCREEN = "add-car";
  const EDIT_CAR_SCREEN = "edit-car";

  const apiBaseUrl = "http://localhost:4333/";

  const [selectedVehicle, setSelectedVehicle] = useState([{}])

  const [currentScreen, setCurrentScreen] = useState(HOME_SCREEN);
  const [vehiclesdata, setVehiclesData] = useState(null);

  const [addVehicleName, setAddVehicleName] = useState('');
  const [addVehicleBrand, setAddVehicleBrand] = useState('');
  const [addVehicleValue, setAddVehicleValue] = useState('');

  const [editVehicleName, setEditVehicleName] = useState('');
  const [editVehicleBrand, setEditVehicleBrand] = useState('');
  const [editVehicleValue, setEditVehicleValue] = useState('');

  const [userName, setUserName] = useState('')
  const [userPassword, setUserPassword] = useState('')

  async function api(url, method, body) {

    var data = null;
    body = JSON.stringify(body);
    await fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then(r => r.json())
      .then(jb => {
        data = jb;
      })
      ,
      rj => console.log(reject);

    return data;
  }

  async function createAccount(name, password, onFinish) {

    await api(apiBaseUrl + `user/signin`, 'POST', { name: name, password: md5(password) }).then((req) => {
      user = { _id: req.user, user: name, vehicleId: req.vehicleId }
      if (onFinish) onFinish();
    });
  }

  async function loginAccount(name, password) {

    await api(apiBaseUrl + `user/login`, 'POST', { name: name, password: md5(password) }).then((req) => {

      if (req.message === 'ok') {
        user = { _id: req.user, user: name, vehicleId: req.vehicleId }

        getVehicles().then((data) => {
          setVehiclesData(data.vehicles);
        });
      }
      else {
        user = null;
      }
    })
  }

  async function getVehicles() {

    var data = null;

    await api(apiBaseUrl + `vehicles`, 'POST', { vehicleId: user.vehicleId }).then((d) => {

      data = d;
    })

    return data;
  }

  async function addVehiclesOnServer(name, value, brand) {

    api(apiBaseUrl + `vehicles/add`, 'POST', { vehicleId: user.vehicleId, name: name, value: value, brand: brand }).then((data) => {

      setVehiclesData(data.vehicles)
      console.log(vehiclesdata)
    })
  }

  async function editVehicle(name, value, brand, index) {

    api(apiBaseUrl + `vehicles/edit`, 'POST', { vehicleId: user.vehicleId, name: name, value: value, brand: brand, index: index }).then((data) => {

      getVehicles().then((d) => {
        setVehiclesData(d.vehicles)
      })
    });
  }

  async function removeVehicle(index) {

    api(apiBaseUrl + `vehicles/remove`, 'POST', { vehicleId: user.vehicleId, index: index }).then(() => {

      getVehicles().then((d) => {
        setVehiclesData(d.vehicles)
      })
    });
  }

  async function deleteVehicleOfServer(url, id) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((result) => { console.log(result) })
  }

  var homeScreen = () => {
    return (
      <View style={mainStyle.root}>
        <View style={mainStyle.screen}>
          <Appbar title={"Login"} />
          <TouchableOpacity
            style={mainStyle.button}
            onPress={() => setCurrentScreen(SIGN_IN_SCREEN)
            }>
            <Text style={{ fontWeight: 'bold' }}>Entrar</Text>
          </TouchableOpacity>
          <View style={{ marginVertical: 5 }} />
          <TouchableOpacity
            style={mainStyle.button}
            onPress={() => setCurrentScreen(CREATE_ACCOUNT_SCREEN)
            }>
            <Text style={{ fontWeight: 'bold' }}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  var loginAccountScreen = () => {

    return (
      <View style={mainStyle.root}>
        <View style={mainStyle.screen}>
          <Appbar title={"Criar conta"} />
          <View style={{ marginVertical: 20 }} />
          <Text style={fields.text}>Nome:</Text>
          <TextInput style={fields.inputField} onChangeText={(value) => setUserName(value)} value={userName} />
          <Text style={fields.text}>Senha:</Text>
          <TextInput style={fields.inputField} onChangeText={(value) => setUserPassword(value)} value={userPassword} />
          <TouchableOpacity style={[mainStyle.button, { marginVertical: 15 }]} onPress={() => {
            loginAccount(userName, userPassword).then(() => {
              if (user) {
                setCurrentScreen(LISTING_SCREEN)
              }
            });
          }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  var createAccountScreen = () => {

    return (
      <View style={mainStyle.root}>
        <View style={mainStyle.screen}>
          <Appbar title={"Criar conta"} />
          <View style={{ marginVertical: 20 }} />
          <Text style={fields.text}>Nome:</Text>
          <TextInput style={fields.inputField} onChangeText={(value) => setUserName(value)} value={userName} />
          <Text style={fields.text}>Senha:</Text>
          <TextInput style={fields.inputField} onChangeText={(value) => setUserPassword(value)} value={userPassword} />
          <TouchableOpacity style={[mainStyle.button, { marginVertical: 15 }]} onPress={() => {

            createAccount(userName, userPassword, () => {
              setCurrentScreen(LISTING_SCREEN)
            })
          }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  var listScreen = () => (
    <View style={mainStyle.root}>
      <View style={mainStyle.screen}>
        <Appbar title={"Carros"} />
        <TouchableOpacity
          style={mainStyle.button}
          onPress={() => setCurrentScreen(ADD_CAR_SCREEN)
          }>
          <Text style={{ fontWeight: 'bold' }}>Adicionar carro</Text>
        </TouchableOpacity>
        <VehiclesList
          vehicles={vehiclesdata}
          onChangeSelectedItem={setSelectedVehicle}
          onPressItem={(item) => {
            console.log(item)
            setCurrentScreen(EDIT_CAR_SCREEN);
            setEditVehicleName(selectedVehicle[0].name);
            setEditVehicleBrand(selectedVehicle[0].brand);
            setEditVehicleValue(selectedVehicle[0].value);
          }
          }
        />
      </View>
    </View>
  );

  var addCarScreen = () => (
    <View style={mainStyle.root}>
      <View style={mainStyle.screen}>
        <Appbar title={"Adicionar carro"} />
        <TouchableOpacity style={mainStyle.button} onPress={() => setCurrentScreen(LISTING_SCREEN)}>
          <Text style={{ fontWeight: 'bold' }}>Lista</Text>
        </TouchableOpacity>
        <View style={{ marginVertical: 20 }} />
        <Text style={fields.text}>Nome:</Text>
        <TextInput style={fields.inputField} onChangeText={setAddVehicleName} value={addVehicleName} />
        <Text style={fields.text}>Marca:</Text>
        <TextInput style={fields.inputField} onChangeText={setAddVehicleBrand} value={addVehicleBrand} />
        <Text style={fields.text}>Value:</Text>
        <TextInput style={fields.inputField} onChangeText={setAddVehicleValue} value={addVehicleValue} />
        <TouchableOpacity style={[mainStyle.button, { marginVertical: 15 }]} onPress={() => {

          addVehiclesOnServer(addVehicleName, addVehicleBrand, addVehicleValue);
          setCurrentScreen(LISTING_SCREEN);
          setAddVehicleName('');
          setAddVehicleBrand('');
          setAddVehicleValue('');
        }}>
          <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  var editCarScreen = () => {

    var v = selectedVehicle[0];

    const updateVehicle = (name, brand, value) => {
      setSelectedVehicle([{ name: name, brand: brand, value: value, index: v.index }])
    }

    return (
      <View style={mainStyle.root}>
        <View style={mainStyle.screen}>
          <Appbar title={"Editar carro"} />
          <TouchableOpacity style={mainStyle.button} onPress={() => setCurrentScreen(LISTING_SCREEN)}>
            <Text style={{ fontWeight: 'bold' }}>Lista</Text>
          </TouchableOpacity>
          <View style={{ marginVertical: 20 }} />
          <Text style={fields.text}>Nome:</Text>
          <TextInput style={fields.inputField} onChangeText={(value) => updateVehicle(value, v.brand, v.value)} value={v.name} />
          <Text style={fields.text}>Marca:</Text>
          <TextInput style={fields.inputField} onChangeText={(value) => updateVehicle(v.name, value, v.value)} value={v.brand} />
          <Text style={fields.text}>Value:</Text>
          <TextInput style={fields.inputField} onChangeText={(value) => updateVehicle(v.name, v.brand, value)} value={v.value} />
          <TouchableOpacity style={[mainStyle.button, { marginVertical: 15 }]}
            onPress={() => {
              editVehicle(v.name, v.value, v.brand, v.index).then(() => {
                setCurrentScreen(LISTING_SCREEN)
              })
            }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[mainStyle.button, { marginVertical: 15 }]} onPress={() => {
            removeVehicle(v.index).then(() => {
              setCurrentScreen(LISTING_SCREEN);
            })
          }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View >
    )
  };

  var screen = null;

  if (currentScreen === HOME_SCREEN) {
    screen = homeScreen();
  }

  if (currentScreen === SIGN_IN_SCREEN) {
    screen = loginAccountScreen();
  }

  if (currentScreen === CREATE_ACCOUNT_SCREEN) {
    screen = createAccountScreen();
  }

  if (currentScreen === LISTING_SCREEN) {
    screen = listScreen();
  }
  if (currentScreen === ADD_CAR_SCREEN) {
    screen = addCarScreen();
  }
  if (currentScreen === EDIT_CAR_SCREEN) {
    screen = editCarScreen();
  }

  return screen;
}