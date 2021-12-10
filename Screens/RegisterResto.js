//----------REACT UTILS-----------
import React, { useEffect, useState } from "react";
//
//
//----------REDUX UTILS-----------
import { useDispatch, useSelector } from "react-redux";
//
//
//----------REACT-NATIVE UTILS-----------
import {
  Button,
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable
} from "react-native";
//
//----------FORMIK y YUP------------------
import { Formik } from 'formik';
import * as yup from 'yup';
//
//
//----------GOOGLE MAPS---------------
import MapView, { Marker } from "react-native-maps";
import { GOOGLE_API_KEY } from "@env";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
//
//
//----------FIREBASE UTILS-----------
import firebase from "../database/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
//
//
//---------------------EXPO----------------------
import * as Location from 'expo-location';
//---------SCREENS & COMPONENTS---------------
//
//
//-------STYLES-------
import globalStyles from "./GlobalStyles";
import { BottomSheet, ListItem } from "react-native-elements";
//
//------IMAGINE PICKER---------
import SetCommerce from "../Redux/Actions/setCommerce";
import{ init } from 'emailjs-com';
init("user_IEK9t1hQIR3ugtExEH6BG");

//
//
//-------INITIALIZATIONS-------
const auth = getAuth();
//
//---------------------------------------------------------------------------------------//
//

const registerRestoSchema = yup.object({
  email: yup.string().required(),
  title: yup.string().required().min(3).max(15),
  description: yup.string().required().min(10).max(60),
  phone: yup.number().required(),
  phone2: yup.number(),
  cuit: yup.number().required(),
});

const RegisterResto = ({ navigation }) => {
  const initialRegion = {
    latitude: -34.61315,
    longitude: -58.37723,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);

  //-------------GEOLOCATION-------------
  const [userLocation, setUserLocation] = useState({})
  const [region, setRegion] = useState(initialRegion);
  const [state, setState] = useState({
    lat: -34.61315,
    lng: -58.37723,
    address: "",
    category: "",
  });
  //----------------------------------------
  const categories = useSelector((state) => state.categoriesResto);

  let id = null;
  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      id = usuarioFirebase.uid;
    }
  });

  useEffect(() => {
    const getUserLocation = async () => {
      const {status} = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      console.log(status)
      let location = await Location.getCurrentPositionAsync();
      setUserLocation(location)
    }
    getUserLocation()
  }, [])
  
   
  const setStateAndRegion = (newLocation, formatedAddress) => {
    const { lat, lng } = newLocation;
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.004757,
      longitudeDelta: 0.006866,
    });
    setState({
      ...state,
      address: formatedAddress,
      lat: lat,
      lng: lng,
    });
  };

  return (
    <View style={globalStyles.Home}>
      <View style={{
        // backgroundColor: '#e8b595',
        width: '80%',
        alignSelf: 'center',
        marginTop: 10,
        // borderRadius: 15,
        maxWidth: '100%',
      }}
      >
        <GooglePlacesAutocomplete
          placeholder="Completa tu direccion"
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          enablePoweredByContainer={false}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
          minLength={3}
          onPress={(data, details = null) =>
            setStateAndRegion(
              details.geometry.location,
              details.formatted_address
            )
          }
          fetchDetails={true}
          styles={{
            container: {
              flex: 0,
              borderRadius: 10,
              width: '75%',
              backgroundColor: '#e8e8e8',
              padding: 0,
              alignSelf: "center",
            },
            textInput: {
              marginTop: 4,
              fontSize: 14.5,

              fontWeight: 'bold',
              width: '80%',
              backgroundColor: 'rgba(22, 22, 22, .2)',
              borderRadius: 10,
              textAlign: 'center',
              overflow: 'hidden'

            },
            textInputContainer: {
              alignItems: "center",
              height: 30,
              overflow: 'hidden',
              borderRadius: 10,
            },
            listView: {
              borderRadius: 15,
              backgroundColor: "#161616",
              // borderRadius: 25,
            },
            description: {},
            row: {
              backgroundColor: "#eccdaa",
              // borderRadius: 25,
            },
          }}
        />
      </View>

      <Formik
        initialValues={{
          email: "",
          title: "",
          description: "",
          phone: "",
          phone2: "",
          cuit: "",
          category: state.category,
          //img: "",
          lat: "",
          lng: "",
          address: "",
        }}
        validationSchema={registerRestoSchema}
        onSubmit={(values) => {
          if (id) {
            try {
              firebase.db
                .collection("Restos")
                .doc()
                .set({
                  idUser: id,
                  email: values.email.toLowerCase(),
                  title: values.title.toLowerCase(),
                  description: values.description.toLowerCase(),
                  phone: values.phone,
                  phone2: values.phone2,
                  cuit: values.cuit,
                  category: state.category.toLowerCase(),
                  // img: values.img,
                  menu: [],
                  reservations: [],
                  location: {
                    latitude: state.lat,
                    longitude: state.lng,
                    address: state.address.toLowerCase()
                  },
                  reviews:[]
                })
                .then(
                  firebase.db.collection("Users").doc(id).update({
                    commerce: true,
                  })
                )
                .then(dispatch(SetCommerce()))
                .then(navigation.navigate("RestoBook"));
            } catch (error) {
              console.log(error);
            }
          } else {
            alert("logueate!");
          }
        }}
      >
        {(props) => (
          <View>
            <ScrollView>
              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                  onBlur={props.handleBlur("email")}
                />
              </View>

              {props.touched.email && props.errors.email ? (
                <Text style={globalStyles.errorText}>{props.errors.email}</Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Titulo"
                  onChangeText={props.handleChange("title")}
                  value={props.values.title}
                  onBlur={props.handleBlur("title")}
                />
              </View>

              {props.touched.title && props.errors.title ? (
                <Text style={globalStyles.errorText}>{props.errors.title}</Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Descripcion"
                  onChangeText={props.handleChange("description")}
                  value={props.values.description}
                  onBlur={props.handleBlur("description")}
                />
              </View>

              {props.touched.description && props.errors.description ? (
                <Text style={globalStyles.errorText}>
                  {props.errors.description}
                </Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Numero de whatsapp"
                  onChangeText={props.handleChange("phone")}
                  value={props.values.phone}
                  onBlur={props.handleBlur("phone")}
                  keyboardType="numeric"
                />
              </View>

              {props.touched.phone && props.errors.phone ? (
                <Text style={globalStyles.errorText}>{props.errors.phone}</Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Telefono 2"
                  onChangeText={props.handleChange("phone2")}
                  value={props.values.phone2}
                  onBlur={props.handleBlur("phone2")}
                  keyboardType="numeric"
                />
              </View>

              {props.touched.phone2 && props.errors.phone2 ? (
                <Text style={globalStyles.errorText}>
                  {props.errors.phone2}
                </Text>
              ) : null}

              <View style={globalStyles.inputComponent}>
                <TextInput
                  style={globalStyles.texts}
                  placeholder="Cuit"
                  onChangeText={props.handleChange("cuit")}
                  value={props.values.cuit}
                  onBlur={props.handleBlur("cuit")}
                  keyboardType="numeric"
                />
              </View>

              {props.touched.cuit && props.errors.cuit ? (
                <Text style={globalStyles.errorText}>{props.errors.cuit}</Text>
              ) : null}

              <Pressable onPress={() => setIsVisible(true)}>
                <View style={globalStyles.inputComponent}>
                  <TextInput
                    style={globalStyles.texts}
                    editable={false}
                    placeholder="Selecciona categoria de local"
                    value={state.category}
                    onPressIn={() => setIsVisible(true)}
                  />
                </View>
              </Pressable>

              <View style={{ alignItems: "center" }}>
                {/* <TouchableOpacity
                  style={globalStyles.touchLog}
                  onPress={() => {
                    handleOnPressPickImage(props.handleChange("img"));
                  }}
                >
                  <Text style={globalStyles.fontLog}>
                    {props.values.img && props.values.img.length > 0
                      ? "Change Image"
                      : "Select Image"}
                  </Text>
                </TouchableOpacity> */}
              </View>

              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={globalStyles.btnLogin}
                  onPress={() => props.handleSubmit()}
                >
                  <Text style={globalStyles.texts}>Crear</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>

      <View style={globalStyles.inputComponent}>

        <BottomSheet
          isVisible={isVisible}

          containerStyle={{ backgroundColor: '#333a' }}

        >
          {categories.map((categoria, index) => (
            <ListItem
              key={index}

              containerStyle={{ backgroundColor: 'rgba(251, 245, 245,0.8)' }}
              style={{ borderBottomWidth: 1, borderColor: '#161616', backgroundColor: "#fff0" }}
              onPress={() => {
                setState({ ...state, category: categoria })
                setIsVisible(false)
              }}
            >
              <ListItem.Content
                style={{ backgroundColor: "#0000", alignItems: "center" }}
              >
                <ListItem.Title
                  style={{ height: 35, color: '#161616', paddingVertical: 5, fontWeight: "bold" }}

                >
                  {categoria}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
          <ListItem
            key={999}

            containerStyle={{ backgroundColor: '#eccdaa' }}
            style={{ borderBottomWidth: 1, borderColor: '#ffff' }}
            onPress={() => setIsVisible(false)}
          >
            <ListItem.Content
              style={{ alignItems: "center" }}
            >
              <ListItem.Title
                style={{ height: 35, color: '#161616', fontSize: 20 }}
              >

                Cancelar
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </BottomSheet>
      </View>

      <View style={{ flex: 3 }}>
        <View style={styles.googleMapsContainer}>
          <MapView style={styles.googleMaps} region={region}>
            <Marker
              draggable
              title="Your Resto"
              coordinate={region}
              onDragEnd={(event) => {
                const { latitude, longitude } = event.nativeEvent.coordinate;
                const newLocation = {
                  lat: latitude,
                  lng: longitude,
                };
                setStateAndRegion(newLocation);
              }}
              pinColor="#eccdaa"
            ></Marker>
          </MapView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  inputGroup: {
    height: 15,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  googleMapsContainer: {
    padding: 5,
  },
  googleMaps: {
    borderColor: "#034F84",
    borderWidth: 1,
    borderRadius: 50,
    height: 250,
  },
});
export default RegisterResto;
