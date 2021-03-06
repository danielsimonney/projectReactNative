
import React, { PureComponent, useEffect,useState } from 'react';
import { AsyncStorage, View,Text,TextInput ,style,Button,StyleSheet, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import LoadScreen from './LoadScreen';
import { api, loadAuthorisationHeader } from "../helpers/axios";


const AddScreen = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const myTrips = useSelector(state => state.trips.trips)
  const auth = useSelector(state => state.auth)
  const currentTrip = useSelector(state => state.currentTrip)
  const [dataTrip, setDataTrip] = useState(false);
  const [notationTrip, setNotationTrip] = useState(false);
  const [dataType, setDataType] = useState(false);
  const [idType, setIdType] = useState(null);
  const [idNotation, setIdNotation] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [idTrip, setIdTrip] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  const [titleTrip, setTitleTrip] = useState(null);
  const [descriptionTrip, setDescriptionTrip] = useState(null);

  const logout = () => {
    dispatch({type:"LOADING"})
    AsyncStorage.removeItem('email').then(email=>{
      AsyncStorage.removeItem('password').then(pass=>{
        AsyncStorage.removeItem('currentStep').then(email=>{
          AsyncStorage.removeItem('currentIndex').then(pass=>{
        dispatch({type:"RESET_LOC"})
        dispatch({type:"LOGOUT"})
        dispatch({type:"END_LOADING"})
          })
        })
    })
  })
}
  const addTrip = (idType,idNotation,titleTrip,descriptionTrip) => {
    if(!idType || !idNotation || !titleTrip || !descriptionTrip){
      Alert.alert("vous n'avez pas bien rempli tout les champs")
    }
    setLoading(true)
    api
    .post("/api/trips", {
      "notation":parseInt(idNotation),
      "description":descriptionTrip,
      "author":`/api/people/${auth.id}`,
      "title": titleTrip,
      "type":`/api/types/${idType}`,
    }).then(res => {
      api
      .get(`/api/user/me`, loadAuthorisationHeader(auth.token))
      .then(resuser => {  
        let trips = resuser.data.trips
        dispatch({type:"SET_USER",payload:{trips}})
      setLoading(false)
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  })
}

  const addloc = (idTrip,latitude,longitude,title,description) => {
    if(!idTrip || !latitude || !longitude || !title || !description){
      Alert.alert("vous n'avez pas bien rempli tout les champs")
    }
    setLoading(true)
    .log(latitude)
    api
      .post("/api/locations", {
        "latitude":parseFloat(latitude),
        "longitude": parseFloat(longitude),
        "description":description,
        "title": title,
        "trip":`/api/trips/${idTrip}`,
      }).then(res => {
        api
      .get(`/api/user/me`, loadAuthorisationHeader(auth.token))
      .then(resuser => {  
        let trips = resuser.data.trips
        dispatch({type:"SET_USER",payload:{trips}})
      setLoading(false)
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
  });
}

  useEffect(() => {
    setLoading(true)
    console.log("auth",auth)
    // setLoading(false)
  //  console.log("trips screen")
    let data = [];
    let itemType = [];
    let notationType = [];
    for (let i = 1; i <= 10; i++) {
      notationType.push({label:i.toString(),value:i.toString()})
    }
    setNotationTrip(notationType)
  for (const property in myTrips) {
    let title = myTrips[property].title
    let id = myTrips[property].id
    data.push({label:title,value:id})
  }
  setDataTrip(data)
  api
  .get(`/api/types`)
  .then(res => {
    let types=(res.data)
    types.forEach(type => {
      itemType.push({label:type.name,value:type.id})
    });
    setDataType(itemType);
    setLoading(false)
  })
  .catch(err => {
    console.log(err)
    setLoading(false)
  })
  }, []);
  return (
    <>
    {loading ?
    <LoadScreen />
    :
    <>
    <Ionicons name={'ios-log-out'} style={{zIndex: 100000,marginTop:30,marginLeft:20}} color={'gray'} size={50}
        onStartShouldSetResponder={() => logout()} />
    <ScrollView style={styles.container}>
      <View style={styles.add}>
        <Text style={styles.title}>
          Add location to one of your trip
        </Text>
        {dataTrip ?
            
      <RNPickerSelect
            value={idTrip}
            placeholder={{}}
            onValueChange={(value) => setIdTrip(value)}
            items={dataTrip}
        /> : null }
        <TextInput
        underlineColorAndroid = "transparent"
        placeholderTextColor = "#9a73ef"
            style={styles.input}
        keyboardType='numeric'
        placeholder="latitude"
        value={latitude}
        onChangeText={setLatitude}
      />
      <TextInput
      underlineColorAndroid = "transparent"
      placeholderTextColor = "#9a73ef"
          style={styles.input}
        keyboardType='numeric'
        placeholder="longitude"
        value={longitude}
        onChangeText={setLongitude}
      />
      <TextInput
      underlineColorAndroid = "transparent"
      placeholderTextColor = "#9a73ef"
          style={styles.input}
        placeholder="title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
      underlineColorAndroid = "transparent"
      placeholderTextColor = "#9a73ef"
          style={styles.input}
        placeholder="description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add new location" onPress={() => addloc(idTrip,latitude,longitude,title,description) } />
      <Text style={styles.title}>
         Add new trip
        </Text>
        {dataType ?
            
            <RNPickerSelect
                  value={idType}
                  placeholder={{}}
                  onValueChange={(value) => setIdType(value)}
                  items={dataType}
              /> : null }
        {notationTrip ?
        <RNPickerSelect
                  value={idNotation}
                  placeholder={{}}
                  onValueChange={(value) => setIdNotation(value)}
                  items={notationTrip}
              /> :
              null}
        

    <TextInput
    underlineColorAndroid = "transparent"
    placeholderTextColor = "#9a73ef"
        style={styles.input}
        placeholder="title"
        value={titleTrip}
        onChangeText={setTitleTrip}
      />
      <TextInput
      underlineColorAndroid = "transparent"
      placeholderTextColor = "#9a73ef"
          style={styles.input}
        placeholder="description"
        value={descriptionTrip}
        onChangeText={setDescriptionTrip}
      />

      <Button title="Add new trip" onPress={() => addTrip(idType,idNotation,titleTrip,descriptionTrip) } />

      </View>

    </ScrollView>
    </>}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f2f2f2",
  },
  add:{
    marginTop:10,
    marginBottom:90
  },
  title: {
    marginTop: 16,
    marginBottom: 15,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold"
  },
  input: {
    padding:5,
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1
 },
  trips:{
    marginBottom:45
  }
})
export default AddScreen;