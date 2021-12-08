import React from "react";
import { StyleSheet } from "react-native";



const globalStyles = StyleSheet.create({
  Home: {
    flex: 1,
    backgroundColor: '#ffdfcb'
  },
  btnHome: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  btnText: {
    fontSize: 12.5,
    color: "#392c28",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: 160,
  },
  Container: {
    alignItems: "center",
  },
  btn: {
    backgroundColor: '#ffd964',
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#b39138',
  },
  img: {
    height: 40,
    width: 40,
    resizeMode: 'contain' // esta linea es para que se adapte al tam;o de la imagen
  },
  
  // --------------------------------------------CARD HOME --------------------------------------------
  cardsContainer: {
    flex: 1,
    alignSelf: "center",
    backgroundColor: "#f6efd3",
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 25,
    width: "95%",
    height: 150
  },
  containerImgCard: {
    width: "31.6%",
    maxHeight: '5%',
    padding: 5,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  cardsHomeimg: {
    marginTop: 5,
    // backgroundColor: "red",
    width: 110,
    height: 120,
    borderRadius: 25,
    justifyContent: "center"
  },
  cardsDescriptionContainer: {
    // backgroundColor: 'green',
    maxHeight: '120%',
    height: '90%',
    width: '35%',
    alignSelf: "center",
    justifyContent: "space-around"
  },
  cardsDescriptionText: {
    // backgroundColor: 'lightblue',
    textAlign: 'center',
    width: '100%',
    fontSize: 13,
    fontWeight: "bold",
  },
  cardsHomeTitle: {
    // backgroundColor: "#5555",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    width: '100%'
  },
  btnContainerCard: {
    // backgroundColor: 'violet',
    maxHeight: '120%',
    height: 120,
    width: '31.6%',
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: -120,
    justifyContent: "space-around"
  },
  wspImage: {
    width: 40,
    height: 40,
    borderRadius: 25
  },
  /// --------------------------------------------ACA TERMINAN  LOS ESTILOS DE LAS CARDS HOM -------
  //------------------------------CARDS MENU-----------------------------------------------------------------
  cardsMenuContainer: {
    flex: 1,
    alignSelf: "center",
    backgroundColor: "#f6efd3",
    marginVertical: 5,
    // paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 25,
    width: "100%",
    height: 150
  },
  cardsMenuDescriptionContainer: {
    maxHeight: '120%',
    height: '100%',
    width: '75%',
    alignSelf: 'flex-start',
    justifyContent: 'space-around',
    paddingHorizontal: 10
  },
  cardsMenuTitle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    width: '100%'
  },
  cardsMenuDescriptionText: {
    textAlign: 'left',
    fontSize: 15,
    color: 'grey',
    marginTop: -15
    
  },
  containerImgCardMenu: {
    width: "25%",
    maxHeight: '5%',
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginTop: '-37%',
    marginRight: '3.5%'
  },
  cardsMenuimg: {
    // marginTop: 5,
    // backgroundColor: "red",
    width: 110,
    height: 120,
    borderRadius: 25,
    justifyContent: "center"
  },
  //------------------------------------------------------------------------------------------------------

  // --------------------------------------------CATEGORIAS LOCAL --------------------------------------------
  categoriesView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 2,
  },
  categoriesText: {
    fontWeight: "bold",
    fontSize: 13,
    padding: 1,
    textAlign:"center"
  },
//----------------------------ACA TERMINA CATEGORIAS LOCALES --------------------------------------------

// ---------------------------- PROFILE USER Y RESTO ----------------------------------------------------
  imgContainer: {
    flex: 2,
    flexDirection: "row",
    // backgroundColor: 'red',
    maxHeight: "25%",
    maxWidth: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  imgProfile: {
    height: 150,
    width: 150,
    borderRadius: 200,
    // resizeMode: 'contain' // esta linea es para que se adapte al tam;o de la imagen
  },
  nombreContainer: {
    flex: 2,
    // backgroundColor: 'grey',
    // marginHorizontal: 5,
    maxWidth: "60%",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
// ------------------------------------------------------------------------------------------------------
//------------------------------MODAL PROFILES-----------------------------------------------------------
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    //backgroundColor: "blur",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    height: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 30,
      height: 30,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
 
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
//------------------------------------------------------------------------------------------------------
  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: '#392c28'
  },
  componentTitle: {
    alignSelf: "center",
    marginTop: 10,
    fontSize: 30,
    color: "#392c28"

  },
  containerTitle: {
    flexDirection: "row",
  },
  navHome: {
    flexDirection: "row",
    width: "100%",
  },
  touchLog: {
    marginTop: 10,
    maxWidth: "100%",
    width: '50%',
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#bd967e",
    padding: 10,
  },
  touchFlag: {
    marginTop: 10,
    maxWidth: "100%",
    width: '50%',
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ffdfcb",
    borderWidth: 2,
    borderColor: "#bd967e",
    padding: 10,
  },
  fontLog: {
    color: "#392c28",
    fontWeight: "bold",
    textAlign: "center"
  },
  btnContainerLogin: {
    flex: 6,
    alignItems: "center",
    maxWidth: '80%',
    width: '100%',
    maxHeight: '70%',
    height: '100%'
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    width: "100%",
  },
  texts: {
    textAlign: "center",
    width: "100%",
    fontSize: 14.5,
    fontWeight: "bold",
  },
  textDownButton: {
    textAlign: "center",
    width: "100%",
    fontSize: 13,
    marginTop: 5,
  },
  errorText: {
    textAlign: "center",
    width: "100%",
    fontSize: 12,
  },
  textContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    width: "70%",
  },
  inputContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputComponent: {
    alignSelf: "center",
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: "#e8b595",
    maxWidth: '100%',
    width: '60%',
  },
  modalInputContainer: {
    flex: 2,
    marginTop: 50,
    alignItems: "center",

  },
});

export default globalStyles;