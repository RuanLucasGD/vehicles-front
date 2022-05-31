import { View, Text } from 'react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Appbar from './components/appBar';

import VehiclesList from './components/vehiclesList';
import { TouchableOpacity, TextInput } from 'react-native-web';

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
    addCarButton: {
      padding: 5,
      marginHorizontal: 7,
      backgroundColor: '#f0A0A0',
      width: 150,
      height: 30,
      left: 10
    }
  });

  const addCarStyle = StyleSheet.create({
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

  const apiBaseUrl = "http://localhost:3000/vehicles";

  const [selectedVehicle, setSelectedVehicle] = useState([{}])

  const [currentScreen, setCurrentScreen] = useState('list');
  const [vehiclesdata, setVehiclesData] = useState(null);

  const [addVehicleName, setAddVehicleName] = useState('');
  const [addVehicleBrand, setAddVehicleBrand] = useState('');
  const [addVehicleValue, setAddVehicleValue] = useState('');

  const [editVehicleName, setEditVehicleName] = useState('');
  const [editVehicleBrand, setEditVehicleBrand] = useState('');
  const [editVehicleValue, setEditVehicleValue] = useState('');


  async function getAllvehicles(url) {

    var data = null;

    await fetch(url)
      .then(r => r.json())
      .then(jb => data = jb)
      ,
      rj => console.log(reject);

    return data;
  }

  async function deleteVehicleOfServer(url, id) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((result) => { console.log(result) })
  }

  async function addVehiclesOnServer(url, data) {

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((result) => { console.log(result) })
  }

  if (currentScreen === 'list') {

  }

  getAllvehicles(apiBaseUrl).then((data) => {

    if (JSON.stringify(data) !== JSON.stringify(vehiclesdata)) {
      setVehiclesData(data);
    }
  });

  var listScreen = () => (
    <View style={mainStyle.root}>
      <View style={mainStyle.screen}>
        <Appbar title={"Carros"} />
        <TouchableOpacity
          style={mainStyle.addCarButton}
          onPress={() => setCurrentScreen('add')
          }>
          <Text style={{ fontWeight: 'bold' }}>Adicionar carro</Text>
        </TouchableOpacity>
        <VehiclesList
          vehicles={vehiclesdata}
          onChangeSelectedItem={setSelectedVehicle}
          onPressItem={() => {
            setCurrentScreen('edit');
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
        <TouchableOpacity style={mainStyle.addCarButton} onPress={() => setCurrentScreen('list')}>
          <Text style={{ fontWeight: 'bold' }}>Lista</Text>
        </TouchableOpacity>
        <View style={{ marginVertical: 20 }} />
        <Text style={addCarStyle.text}>Nome:</Text>
        <TextInput style={addCarStyle.inputField} onChangeText={setAddVehicleName} value={addVehicleName} />
        <Text style={addCarStyle.text}>Marca:</Text>
        <TextInput style={addCarStyle.inputField} onChangeText={setAddVehicleBrand} value={addVehicleBrand} />
        <Text style={addCarStyle.text}>Value:</Text>
        <TextInput style={addCarStyle.inputField} onChangeText={setAddVehicleValue} value={addVehicleValue} />
        <TouchableOpacity style={[mainStyle.addCarButton, { marginVertical: 15 }]} onPress={() => {

          addVehiclesOnServer(apiBaseUrl, { name: addVehicleName, brand: addVehicleBrand, value: addVehicleValue });
          setCurrentScreen('list');
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
      setSelectedVehicle([{ _id: v._id, name: name, brand: brand, value: value }])
    }

    return (
      <View style={mainStyle.root}>
        <View style={mainStyle.screen}>
          <Appbar title={"Editar carro"} />
          <TouchableOpacity style={mainStyle.addCarButton} onPress={() => setCurrentScreen('list')}>
            <Text style={{ fontWeight: 'bold' }}>Lista</Text>
          </TouchableOpacity>
          <View style={{ marginVertical: 20 }} />
          <Text style={addCarStyle.text}>Nome:</Text>
          <TextInput style={addCarStyle.inputField} onChangeText={(value) => updateVehicle(value, v.brand, v.value)} value={v.name} />
          <Text style={addCarStyle.text}>Marca:</Text>
          <TextInput style={addCarStyle.inputField} onChangeText={(value) => updateVehicle(v.name, value, v.value)} value={v.brand} />
          <Text style={addCarStyle.text}>Value:</Text>
          <TextInput style={addCarStyle.inputField} onChangeText={(value) => updateVehicle(v.name, v.brand, value)} value={v.value} />
          <TouchableOpacity style={[mainStyle.addCarButton, { marginVertical: 15 }]}
            onPress={() => {
              addVehiclesOnServer(apiBaseUrl, { _id: v._id, name: v.name, brand: v.brand, value: v.value });
              setCurrentScreen('list');
            }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[mainStyle.addCarButton, { marginVertical: 15 }]} onPress={() => {
            deleteVehicleOfServer(apiBaseUrl + `/delete`, v._id);
            setCurrentScreen('list');
          }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View >
    )
  };

  var screen = null;

  if (currentScreen === 'list') {
    screen = listScreen();
  }
  if (currentScreen === 'add') {
    screen = addCarScreen();
  }
  if (currentScreen === 'edit') {
    screen = editCarScreen();
  }

  return screen;
}