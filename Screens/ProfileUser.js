import React, { useState, useRef, useEffect } from "react";
import { CLOUDINARY_URL, CLOUDINARY_CONSTANT } from "@env";
import { useSelector } from "react-redux";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  useWindowDimensions,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
//------FIREBASE----------------
import firebase from "../database/firebase";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  doc,
  onSnapshot,
  collection,
  query,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import StarFilled from "react-native-vector-icons/AntDesign";
import TagOutlined from "react-native-vector-icons/AntDesign";
//--------------------------------
//---------STYLES-----------------
import globalStyles from "./GlobalStyles";
//--------------------------------
//-------COMPONENTS---------------
import CardReservation from "../components/CardReservation";
import CardFavourite from "../components/CardFavourite";
//---------------------------------

const auth = getAuth();

const reservas = [
  {
    id: 1,
    name: "Laial",
    email: "@laialasase",
    reserva: {
      cantidad: 2,
      fecha: "1/12/2021",
      horario: "22.00hs",
      bar: {
        barName: "Los campeones",
        direccion: "Wilde 200",
      },
    },
  },
  {
    id: 2,
    name: "Rama",
    email: "@ramifazio",
    reserva: {
      cantidad: 5,
      fecha: "02/01/2021",
      horario: "00.00hs",
      bar: {
        barName: "Nebraska",
        direccion: "Laprida 600",
      },
    },
  },
];

const ProfileUser = ({ navigation }) => {
  const empresas = useSelector((state) => state.empresas);

  const loggedUser = useSelector((state) => state.currentUser);

  const loggedId = useSelector((state) => state.currentId);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [newUserInfo, setNewUserInfo] = useState({});
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [myFavourites, setMyFavourites] = useState();

  useEffect(() => {
    const q = doc(firebase.db, "Users", loggedId);
    const unsubscribe = onSnapshot(q, (doc) => {
      setMyFavourites(doc.data().favourites);
    });
  }, [loggedId]);

  // useEffect(() => {
  //   console.log("state favs", myFavourites);
  // }, [myFavourites]);

  useEffect(() => {
    const getInfo = async () => {
      const docRef = doc(firebase.db, "Users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let obj = docSnap.data();

        setImage(obj.profileImage);
        setCurrentUser(obj);
        setNewUserInfo(obj);
        // setMyFavourites(obj.favourites);
        // console.log(obj.favourites)
      } else {
        alert("NO HAY INFO");
      }
    };
    getInfo();
  }, []);

  let openImagePickerAsync = async () => {
    setUploading(true);
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Se necesita el permiso para acceder a la galería!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (pickerResult.cancelled === true) {
      setUploading(false);
      return;
    }

    let base64Img = `data:image/jpg;base64,${pickerResult.base64}`;

    let data = {
      file: base64Img,
      upload_preset: "restohenry",
    };

    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then(async (r) => {
        let data = await r.json();
        let str = data.secure_url.split("restohenry/")[1];
        setImage(str);
        firebase.db.collection("Users").doc(loggedId).update({
          profileImage: str,
        });
        setUploading(false);
      })
      .catch((err) => console.log(err));
  };

  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={globalStyles.Perfilcontainer}>
      <ScrollView
        style={globalStyles.Perfilcontainer}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={globalStyles.imgContainer}>
          {image && !uploading ? (
            <TouchableOpacity onPress={openImagePickerAsync}>
              <Image
                source={{
                  uri: CLOUDINARY_CONSTANT + image,
                }}
                style={globalStyles.imgProfile}
              />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator
              size="large"
              color="#5555"
              style={globalStyles.imgProfile}
            />
          )}
          <View style={globalStyles.nombreContainer}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: "#392c28",
                textAlignVertical: "top",
              }}
            >
              {currentUser?.name}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#392c28",
                paddingVertical: 15,
              }}
            >
              {currentUser?.email}
            </Text>
            <TouchableOpacity
              style={globalStyles.btn}
              onPress={() => setModalVisible(true)}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={globalStyles.centeredView}>
                <View style={globalStyles.modalView}>
                  <TouchableOpacity
                    style={globalStyles.touchLog}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text
                      onPress={() => setModalVisible(false)}
                      style={globalStyles.textStyle}
                    >
                      X
                    </Text>
                  </TouchableOpacity>
                  <Text style={globalStyles.modalText}>Edit your Username</Text>
                  <Text>Nombre</Text>
                  <TextInput
                    style={globalStyles.texts}
                    placeholder={currentUser?.name}
                    onChangeText={(value) =>
                      setNewUserInfo({
                        ...newUserInfo,
                        name: value,
                      })
                    }
                  />
                  <Text>Apellido</Text>
                  <TextInput
                    style={globalStyles.texts}
                    placeholder={currentUser?.lastName}
                    onChangeText={(value) =>
                      setNewUserInfo({
                        ...newUserInfo,
                        lastName: value,
                      })
                    }
                  />
                  <Text>Celular</Text>
                  <TextInput
                    style={globalStyles.texts}
                    placeholder={currentUser?.cel}
                    onChangeText={(value) =>
                      setNewUserInfo({
                        ...newUserInfo,
                        cel: value,
                      })
                    }
                  />
                  <TouchableOpacity
                    style={globalStyles.touchLog}
                    onPress={() => {
                      sendPasswordResetEmail(auth, currentUser?.email)
                        .then(alert("Revisa tu casilla y volve a ingresar!"))
                        .then(signOut(auth))
                        .then(setModalVisible(false))
                        .then(navigation.navigate("RestoBook"));
                    }}
                  >
                    <Text>Cambiar contraseña</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={globalStyles.touchLog}
                    onPress={() => {
                      firebase.db
                        .collection("Users")
                        .doc(currentUser.id)
                        .update({
                          name: newUserInfo.name,
                          lastName: newUserInfo.lastName,
                          cel: newUserInfo.cel,
                        })
                        .then(alert("cambios guardados!"))
                        .then(setModalVisible(false))
                        .catch((error) => alert("error!"));
                    }}
                  >
                    <Text>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
        <Text style={{ fontSize: 25, color: "#392c28", textAlign: "center" }}>
          {" "}
          <StarFilled name="star" color="#392c28" size={25} /> Mis Favoritos
        </Text>
        <Divider
          orientation="horizontal"
          width={2}
          inset={true}
          insetType={"middle"}
          color={"black"}
          style={{ marginVertical: 10 }}
        />
        <ScrollView
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={globalStyles.FavouriteContainer}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ])}
          scrollEventThrottle={1}
        >
          {myFavourites?.length
            ? myFavourites?.map((resto) => {
                return (
                  <View style={{ width: windowWidth, height: 250 }}>
                    <CardFavourite
                      key={resto.Id}
                      resto={resto}
                      navigation={navigation}
                      index={resto.Id}
                    >
                      {" "}
                    </CardFavourite>
                  </View>
                );
              })
            : null}
        </ScrollView>
        <Text style={{ fontSize: 25, color: "#392c28", textAlign: "center" }}>
          <TagOutlined name="tag" color="#392c28" size={25} /> Mis Reservas
        </Text>
        <Divider
          orientation="horizontal"
          width={2}
          inset={true}
          insetType={"middle"}
          color={"black"}
          style={{ marginVertical: 5 }}
        />
        <ScrollView style={{ overflow: "scroll" }}>
          {reservas.map((persona) => {
            return (
              <View>
                <CardReservation
                  key={persona.id}
                  persona={persona}
                  index={persona.id}
                />
              </View>
            );
          })}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default ProfileUser;

///////////////////FUNCION STORAGE FIREBASE LAIAL COMENTADA PARA REVISION///////////
// const uploadImage = async () => {
//     const blob = await new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.onload = function() {
//           resolve(xhr.response);
//         };
//         xhr.onerror = function() {
//           reject(new TypeError('Network request failed'));
//         };
//         xhr.responseType = 'blob';
//         xhr.open('GET', image, true);
//         xhr.send(null);
//       });

//     const ref = firebase.storage.ref().child(new Date().toISOString())
//     const snapshot = ref.put(blob)

//     snapshot.on(
//         firebase.storage.TaskEvent.STATE_CHANGED,
//         () => {
//         setUploading(true)
//     },
//     (error)=> {
//         setUploading(false)
//         console.log(error)
//         blob.close()
//         return
//     },
//     () => {
//         snapshot.snapshot.ref.getDownloadURL().then((url)=> {
//             setUploading(false)
//             console.log('download url: ', url)
//             blob.close();
//             return url
//         })
//     }
//     )
// }
// return (
//     <View style={styles.container} >
//         <ScrollView style={styles.container} contentContainerStyle={{flex: 1}}>
//             <View style={styles.imgContainer}>
//                 {
//                     !image ?
//                     <Image
//                         source={'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg'}
//                         style={styles.img}
//                     />
//                     :
//                     <Image
//                         source={image.localUri}
//                         style={styles.img}
//                     />
//                 }
//                 {/* {
//                     image ? (<TouchableOpacity onPress={openImagePicker}>
//                         <Image
//                             source={{ uri: image !== null ? image.localUri : 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg' }}
//                             style={styles.img}
//                         />
//                     </TouchableOpacity>)
//                         : (<TouchableOpacity onPress={openImagePicker}>
//                             <Image
//                                 source={{ uri: image !== null ? image.localUri : 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg' }}
//                                 style={styles.img}
//                             />
//                         </TouchableOpacity>
//                         )

//                     } */}
//                     {/* { // si la imagen no se esta cargando a firebase que este el boton
//                         !uploading ? <TouchableOpacity
//                         style={globalStyles.btn}
//                         onPress={uploadImage}
//                         >
//                             <Text>SUBIR IMAGEN</Text>
//                         </TouchableOpacity>
//                         :
//                         // y cuando se este cargando que active el spiner
//                         (
//                         <ActivityIndicator size='large' color='#5555'/>
//                         )
//                     } */}
///////////////////////////////////////////////////////////////////////////
