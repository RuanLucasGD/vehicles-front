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

    if (!vehicles) { <View /> }

    const listItem = (v) => {

        v = v.item;
        return (
            <TouchableOpacity style={styles.item} onPress={() => {
                if (onChangeSelectedItem) onChangeSelectedItem([v]);
                if (onPressItem) onPressItem();
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
                keyExtractor={v => v._id}
            />
        </SafeAreaView>
    )
}