import { View, Text } from "react-native-web";
import { StyleSheet } from "react-native-web";

const styles = StyleSheet.create({
    appBar: {
        heigth: 100,
        backgroundColor: '#8d99ae',
        marginBottom: 10
    },
    title: {
        padding: 20,
        fontWeight: 'bold',
        color: '#2b2d42'
    }
});

export default function Appbar({ title }) {

    return (
        <View style={styles.appBar}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}