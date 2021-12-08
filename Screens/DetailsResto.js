//----------REACT UTILS-----------
import React, { useState, useEffect } from "react";
//
//
//----------REDUX UTILS-----------
import { useSelector } from "react-redux";
//
//
//----------REACT-NATIVE UTILS-----------
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
//import DateTimePicker from '@react-native-community/datetimepicker';
//
//
//----------FIREBASE UTILS-----------
import { getAuth } from "firebase/auth";
import { onSnapshot, collection, query, doc, updateDoc, arrayUnion } from "firebase/firestore";

import firebase from "../database/firebase";
import { MaterialIcons } from "@expo/vector-icons";
//
//
//---------SCREENS & COMPONENTS---------------
import CardMenu from "../components/CardMenu";
//
//
//-------STYLES-------
import globalStyles from "./GlobalStyles";

//
//
//-------INITIALIZATIONS-------
const auth = getAuth();

//
//---------------------------------------------------------------------------------------//
//
const DetailsResto = ({ navigation }) => {
  const empresaDetail = useSelector((state) => state.empresaDetail);
  const { location } = empresaDetail


  //console.log(location)
  const number = "+541168020511"
  //WhatsApp
  const handleWhatsAppPress = async () => {

    await Linking.openURL(`whatsapp://send?text=Hola RestoBook&phone=${number}`)
  }
  const [menuArr, setMenuArr] = useState([]);
  //Tiene que desactivar el boton en los comercios que no sean del logueado

  useEffect(() => {
    const q = query(collection(firebase.db, "Restos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let menu = [];
      querySnapshot.forEach((doc) => {
        if (doc.id === empresaDetail.idResto) {
          //console.log("yes!");
          let obj = doc.data();
          menu = obj.menu;
          setMenuArr(menu);
        }
      });
    });
  }, []);

  const getCurrentDate = () => {
    let min = new Date().getMinutes().toString();
    let hour = new Date().getHours().toString();
    let date = new Date().getDate().toString();
    let month = (new Date().getMonth() + 1).toString();
    let year = new Date().getFullYear().toString();
    return hour + min + date + month + year;// 22:10 12/10/2021
  }
  console.log(getCurrentDate())

  /*try {
            let restoRef = doc(firebase.db, "Restos", idResto);
            setSpinner(true);
            await updateDoc(restoRef, {
              menu: arrayUnion(newValues),
            });
            setSpinner(false);
            navigation.navigate("DetailsResto");
          } catch (err) {
            console.log(err);
          } */

  const handleReserva = async () => {
    if (auth.currentUser) {
      const reserva = {
        idReserva: getCurrentDate(),
        emailUser: auth.currentUser.email,
        idUser: auth.currentUser.uid,
        nameResto: empresaDetail.title,
        idResto: empresaDetail.idResto
      };

      try {
        let restoRef = doc(firebase.db, "Users", auth.currentUser.uid);
        await updateDoc(restoRef, {
          reservations: arrayUnion(reserva),
        })
      } catch (err) {
        console.log(err);
      }
      try {
        let restoRef = doc(firebase.db, "Restos", empresaDetail.idResto);
        await updateDoc(restoRef, {
          reservations: arrayUnion(reserva),
        })
      } catch (err) {
        console.log(err);
      }
      alert("Su reserva ha sido registrada!")
    } else {
      alert("Logueate antes de reservar!")
    }
  }


  return (
    <View style={globalStyles.Home}>
      <View style={{ backgroundColor: "#fff" }}>
        <Text style={{ textAlign: "center", fontSize: 30, marginVertical: 10, }}>{empresaDetail.title}</Text>
      </View>

      <View>
        <TouchableOpacity
          style={globalStyles.btn}
          onPress={handleReserva}
        >
          <Text>Reservar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.categoriesContainer}>
          <View style={globalStyles.categoriesView}>
            <Text style={globalStyles.categoriesText}>Fast Food</Text>
          </View>
          <View style={globalStyles.categoriesView}>
            <Text style={globalStyles.categoriesText}>Home-made pastas</Text>
          </View>
          <View style={globalStyles.categoriesView}>
            <Text style={globalStyles.categoriesText}>Meats</Text>
          </View>
          <View style={globalStyles.categoriesView}>
            <Text style={globalStyles.categoriesText}>Deserts</Text>
          </View>
          <View style={globalStyles.categoriesView}>
            <Text style={globalStyles.categoriesText}>Drinks</Text>
          </View>

        </View>
        {menuArr.length > 0 ? (
          <ScrollView style={styles.showMenu}>
            {menuArr.map((menu, index) => {
              return (
                <CardMenu key={index} menu={menu}>
                  {" "}
                </CardMenu>
              );
            })}
          </ScrollView>
        ) : (
          <Text
            style={{ alignSelf: "center", fontSize: 30, marginVertical: 30 }}
          >
            {" "}
            Add a food to see it!
          </Text>
        )}
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("WebViewScreen")}
            style={globalStyles.btn}>
            <Text><MaterialIcons name="payment" size={20} color="black" ></MaterialIcons> Pagar: $100 de tu reserva
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.googleMapsContainer}>
          <MapView
            style={styles.googleMaps}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.004757,
              longitudeDelta: 0.006866,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              pinColor='#0072B5'
            >

            </Marker>
          </MapView>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
  titleContainer: {
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "skyblue",
  },
  title: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 30,
    color: "#333",
    letterSpacing: 1,
  },
  content: {
    padding: 10,
  },
  categoriesContainer: {
    height: 33,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 20,
    marginBottom: 5,
  },
  showMenu: {
    height: 250,
    padding: 10,
    borderWidth: 0,
    //borderRadius: 50
  },
  googleMapsContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    //backgroundColor: "red"
  },
  googleMaps: {
    height: 250,
    borderRadius: 30,
  },
  wppIcon: {
    height: 30,
    marginLeft: 10,
    borderRadius: 10,
    width: 40,
    backgroundColor: '#ffd964',
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#b39138',

  },
  img: {
    margin: 5,
    height: 20,
    width: 20,
    alignItems: 'center'
  },
  textContainer2: {
    alignSelf: "center",
    justifyContent: "center",
    width: "60%",
    borderRadius: 10,
    borderWidth: 3,
    marginTop: 10,
    backgroundColor: '#ffd964'
  },
});

export default DetailsResto;
