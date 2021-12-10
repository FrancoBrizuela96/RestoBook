//----------REACT UTILS-----------
import React, { useState, useEffect } from "react";
//
//----------REDUX UTILS-----------
import { useDispatch, useSelector } from "react-redux";
import CurrentId from "../Redux/Actions/CurrentId.js";
import CurrentUser from "../Redux/Actions/CurrentUser.js";
import UserFavourites from "../Redux/Actions/userFavourites.js";
//
//
//----------REACT-NATIVE UTILS-----------
import { BottomSheet, ListItem } from "react-native-elements";
import {
  View,
  Image,
  ScrollView,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
//import { MaterialIcons } from "@expo/vector-icons";
//
//
//---------------------EXPO----------------------
import * as Location from 'expo-location';
//----------FIREBASE UTILS-----------
import firebase from "../database/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, collection, query, getDoc } from "firebase/firestore";
//
//
//---------SCREENS---------------
import SearchBar from "./SearchBar.js";
import CardHome from "../components/CardHome.js";
import Btn from "./Helpers/Btns.js";
//
//
//-------STYLES-------
import globalStyles from "./GlobalStyles.js";
//
//
//-------INITIALIZATIONS-------
const auth = getAuth();
import { DEFAULT_PROFILE_IMAGE } from "@env";
import setUserLocation from "../Redux/Actions/setUserLocation.js";

//
//---------------------------------------------------------------------------------------//
//
export default function Home({ navigation }) {
  //------LOGIN JOSE------------
  const [visible, isVisible] = useState(false);
  const [googleUser, setGoogleUser] = useState({
    name: "",
    lastName: "",
    cel: "",
    email: "",
  });
  const [usuarioGlobal, setUsuarioGlobal] = useState("");
  const [availableCommerces, setAvailableCommerces] = useState([]);
  const [flagCards, setFlagCards] = useState(false);

  //--------------FILTRADO MODAL-------------------------
  const [allRestos, setAllRestos] = useState()
  const [category, setCategory] = useState();
  const [visibleFiltros, isVisibleFiltros] = useState(false);
  //console.log(availableCommerces)
  const loggedUser = useSelector((state) => state.currentUser);
  const loggedId = useSelector((state) => state.currentId);
  const categories = useSelector((state) => state.categoriesResto);
  const dispatch = useDispatch();

  useEffect(() => {
    const q = query(collection(firebase.db, "Restos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((doc) => {
        let obj = doc.data();
        obj.idResto = doc.id;
        arr.push(obj);
      });
      setAvailableCommerces(arr);
      setAllRestos(arr);
    });
  }, []);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase?.emailVerified) {
      if (loggedId !== usuarioFirebase.uid) {
        dispatch(CurrentId(usuarioFirebase.uid));
        const unsub = onSnapshot(
          doc(firebase.db, "Users", usuarioFirebase.uid),
          (doc) => {
            if (doc.exists()) {
              dispatch(CurrentUser(doc.data()));
              //console.log("data user en home : ", doc.data());
            }
          }
        );
      }
    } else {
      dispatch(CurrentUser(null));
    }
  });

  const getUserLocation = async () => {
    const {status} = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    console.log('Permission granted, reading user coordinates...')
    let {coords} = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced});
    console.log(coords)
    const location = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.004757,
      longitudeDelta: 0.006866,
    } 
    dispatch(setUserLocation(location))
  }

  const getInfo = async () => {
    try {
      const docRef = doc(firebase.db, "Users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setGoogleUser({ ...googleUser, email: auth.currentUser.email });
        isVisible(true);
        // alert("Bienvenido! Por favor, completa estos datos antes de continuar");
      } else {
        let obj = docSnap.data();
        let idsFavourites = obj.favourites.map((element) => element.id);
        dispatch(UserFavourites(idsFavourites));
        setFlagCards(true);
      }
    } catch (e) {
      console.log("error get", e);
    }
  };
  useEffect(() => {
    if (loggedId && auth.currentUser.uid) {
      getInfo();
      getUserLocation()
    }
    setFlagCards(true);
  }, [loggedId]);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase?.emailVerified) {
      if (usuarioFirebase.displayName) {
        //console.log("entre a if")
        setUsuarioGlobal(usuarioFirebase.displayName);
      } else {
        //console.log("entre a else")
        const trimmedName = usuarioFirebase.email.split("@")[0];
        setUsuarioGlobal(trimmedName);
      }
    } else {
      //console.log("entre a else else")
      setUsuarioGlobal("");
    }
  });


  const handleCategory = async (category) => {
    setCategory(category)
    if (!category) setAvailableCommerces(allRestos)
    const result = availableCommerces.filter((resto) => resto.category === category.toLowerCase())
    if (result.length === 0) {
      alert("No hay comidas con esta categoria")
      setCategory("")
      setAvailableCommerces(allRestos)
    } else {
      setAvailableCommerces(result)
    }
  }


  return (
    <ScrollView style={globalStyles.Home}>
      {/* <BottomSheet isVisible={false}>
        <View>
          <Text>Hola!</Text>
        </View>
      </BottomSheet> */}
      <Modal visible={visible} style={styles.googleUserModal}>
        <View style={styles.googleUserForm}>
          <TextInput
            style={styles.googleTextinput}
            placeholder="Nombre"
            onChangeText={(value) => {
              setGoogleUser({
                ...googleUser,
                name: value,
              });
            }}
          />
          <TextInput
            placeholder="Apellido"
            onChangeText={(value) => {
              setGoogleUser({
                ...googleUser,
                lastName: value,
              });
            }}
          />
          <TextInput
            placeholder="Celular"
            onChangeText={(value) => {
              setGoogleUser({
                ...googleUser,
                cel: value,
              });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              firebase.db.collection("Users").doc(auth.currentUser.uid).set({
                id: auth.currentUser.uid,
                name: googleUser.name,
                lastName: googleUser.lastName,
                cel: googleUser.cel,
                email: googleUser.email,
                commerce: false,
                profileImage: DEFAULT_PROFILE_IMAGE,
                reservations: [],
                payments: [],
              });
              isVisible(false);
              alert("Gracias!");
            }}
          >
            <Text>Enviar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.textContainer}>
        {usuarioGlobal !== "" ? (
          <Text style={styles.text}>{` Welcome ${usuarioGlobal}`}</Text>
        ) : (
          <Text style={styles.text}>Welcome to Resto Book</Text>
        )}
      </View>
      <View>
        <SearchBar />
      </View>

      <View style={globalStyles.btnHome}>
        {/* <Btn nombre="Categorias" ruta="#" navigation={navigation} /> */}
        <Btn
          nombre={
            usuarioGlobal !== ""
              ? `Create your resto, ${usuarioGlobal}!`
              : `Crea tu resto!`
          }
          ruta="RegisterResto"
          navigation={navigation}
        />
        {/*----------------------------------------FILTRADO------------------------------------------- */}
        <View>
          <TextInput
            style={globalStyles.btn}
            editable={false}
            placeholder="Buscar por Categoria"
            placeholderTextColor="#000"
            value={category}
            onPressIn={() => isVisibleFiltros(true)}
          />
          <BottomSheet
            isVisible={visibleFiltros}
            containerStyle={{ backgroundColor: '#333a' }}
          >
            <ListItem
              containerStyle={{ backgroundColor: 'rgba(0.5,0.25,0,0.7)' }}
              style={{ borderBottomWidth: 1, borderColor: '#333a', backgroundColor: "#fff0" }}
              onPress={() => {
                handleCategory(null)
                isVisibleFiltros(false)
              }}
            >
              <ListItem.Content
                style={{ backgroundColor: "#0000", alignItems: "center" }}
              >
                <ListItem.Title
                  style={{ height: 35, color: '#fff', padding: 8 }}
                >
                  Todos
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            {categories.map((categoria, index) => (
              <ListItem
                key={index}
                containerStyle={{ backgroundColor: 'rgba(0.5,0.25,0,0.7)' }}
                style={{ borderBottomWidth: 1, borderColor: '#333a', backgroundColor: "#fff0" }}
                onPress={() => {
                  handleCategory(categoria)
                  isVisibleFiltros(false)
                }}
              >
                <ListItem.Content
                  style={{ backgroundColor: "#0000", alignItems: "center" }}
                >
                  <ListItem.Title
                    style={{ height: 35, color: '#fff', padding: 8 }}
                  >
                    {categoria}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
            <ListItem
              key={999}
              containerStyle={{ backgroundColor: '#d14545' }}
              style={{ borderBottomWidth: 1, borderColor: '#333a' }}
              onPress={() => isVisibleFiltros(false)}
            >
              <ListItem.Content style={{ alignItems: "center" }}>
                <ListItem.Title
                  style={{ height: 35, color: '#FFF', padding: 8, fontSize: 20 }}
                >
                  Cancelar
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </BottomSheet>
        </View>


      </View>
      {availableCommerces.length && flagCards ? (
        <View>
          {availableCommerces.map((resto) => {
            return (
              <CardHome
                key={resto.idResto}
                resto={resto}
                navigation={navigation}
              ></CardHome>
            );
          })}
        </View>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#5555" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    alignSelf: "center",
    justifyContent: "center",
    width: "90%",
    borderColor: "#bd967e",
    borderRadius: 10,
    borderWidth: 3,
    marginTop: 10,
  },
  textContainer2: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    width: "40%",
    borderRadius: 10,
    borderWidth: 3,
    marginTop: 10,
  },
  text: {
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    paddingVertical: 5,
    fontWeight: "bold",
    color: "#392c28",
  },

  textContainer2: {
    alignSelf: "center",
    justifyContent: "center",
    width: "40%",
    borderRadius: 10,
    borderWidth: 3,
    marginTop: 10,
  },
  forgottenPass: {
    backgroundColor: "antiquewhite",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderBottomWidth: 5,
    borderBottomColor: "black",
  },

  inputForgotten: {
    marginTop: 200,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "orange",
  },
  // googleUserModal: {
  //   backgroundColor: "#f0f",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  googleUserForm: {
    backgroundColor: "grey",
    padding: 20,
    // textAlign: "center",
    // justifyContent: "center",
    // alignContent: "center",
  },
  googleTextinput: {
    padding: 10,
  },
  loading: {
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
});
