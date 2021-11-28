import React from "react";
import { Card, Text } from "react-native-elements";
import { View, Image, StyleSheet } from "react-native"; 4
import Btn from '../Screens/Helpers/Btns.js'

const CardMenu = ({ resto, navigation }) => {
    return (
        <Card style={styles.container}>
            <View style={{}}>
                <Card.Title>{resto.Title}</Card.Title>
                <Card.Divider />
                <View style={{ alignItems: "center" }}>
                    <Image
                        style={styles.imagen}
                        resizeMode="contain"
                        source={{ uri: resto.Img }}
                        resizeMode="contain"
                    />
                    <Text style={{ padding: 5 }}>{resto.Description}</Text>
                    <View style={{}}>
                        <Btn nombre="About" ruta="DetailsResto" navigation={navigation} />
                    </View>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    imagen: {
        width: 140,
        height: 140,
    },
})

export default CardMenu;