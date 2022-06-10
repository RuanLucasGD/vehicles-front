import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-web';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#8d99ae',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2b2d42'
    },
});


export default function VehiclesList({ vehicles, onChangeSelectedItem, onPressItem }) {

    if (!vehicles) { return <View /> }

    vehicles = vehicles;

    var index = 0;



    for (let i = 0; i < vehicles.length; i++) {
        let v = vehicles[i];
        vehicles[i] = { name: v.name, value: v.value, brand: v.brand, index: i }
    }

    console.log(vehicles)

    const listItem = (v, i) => {
        v = v.item;
        return (
            <TouchableOpacity style={styles.item} onPress={() => {
                if (onChangeSelectedItem) onChangeSelectedItem([v]);
                if (onPressItem) onPressItem(v);
            }}>
                <Text style={styles.title}>{v.name}</Text>
            </TouchableOpacity >
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={vehicles}
                renderItem={listItem}
                keyExtractor={v => {
                    index += 1;
                    return index;
                }}
            />
        </SafeAreaView>
    )
}