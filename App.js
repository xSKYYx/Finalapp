import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Alert, Vibration, Platform, ImageBackground, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator , useNavigation} from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

const Stack = createNativeStackNavigator();
const Homescreen = ({ navigation }) => {
    const EnterBook = () => { navigation.navigate('select'); };
    const instructions = { AppInstructions: 'View recipes you have or store new ones that you have create. Have fun cooking!' };

    return (
        <ImageBackground
            source={require('./images/background.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>

                <Text style={{ textAlign: 'center', marginBottom: 50, fontSize: 35, top: 35, color: '#9C2197', fontWeight:'600' }}>{instructions.AppInstructions}</Text>


                <View style={{ backgroundColor: '#13F2DF', width: 300, height: 70, borderRadius: 10, marginBottom: 17, marginTop: 30, justifyContent: 'center' }}>
                    <Button title="Enter the Cook Book" onPress={EnterBook} color="#9C2197"/>
                </View>


            </View>
        </ImageBackground>
    );
};

const Selectpage = ({ navigation }) => {
    const CurrentRecipe = () => { navigation.navigate('currentR'); };
    const CreateNew = () => { navigation.navigate('CreateNew', { navigation }); }; // Pass the navigation prop
    const Reference = () => { navigation.navigate('references'); };

    return (
        <ImageBackground
            source={require('./images/background.png')}
            style={styles.backgroundImage}
        >


            <View style={styles.container}>
                <Text style={{ fontSize: 30, marginBottom: 40, fontWeight:'900' }}>PLEASE SELECT</Text>

                <View style={{ backgroundColor: '#A60D94', width: 200, height: 50, borderRadius: 10, marginBottom: 17 }}>
                    <Button title="Current Recipes" onPress={CurrentRecipe} color="#13F2DF" />
            </View>
                <View style={{ backgroundColor: '#A60D94', width: 200, height: 50, borderRadius: 10, marginBottom: 17 }}>
                    <Button title="Create Recipe" onPress={CreateNew} color="#13F2DF"/>
            </View>
                <View style={{ backgroundColor: '#A60D94', width: 200, height: 50, borderRadius: 10, marginBottom: 17 }}>
                    <Button title="Online References" onPress={Reference} color="#13F2DF"/>
            </View>
            </View>
        </ImageBackground>
    );
};

const CurrentRecipes = ({ names }) => {

    const showRecipe = () => {
        if (!names || names.length === 0) {
            return <Text>No recipes found.</Text>;
        }
        return names.map((name, index) => {
            return (
                <View key={index}>
                    <Text>name:{name.name}</Text>
                    <Text>Ingredients: {name.ingredients}</Text>
                    <Text>Instructions: {name.instructions}</Text>
                </View>
            );
        });
    };

    return (
        <ImageBackground source={require('./images/background2.png')} style={styles.backgroundImage2}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                {showRecipe()}
            </View>
        </ImageBackground>
    );
};


const CreateNewRecipe = ({ navigation }) => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [names, setNames] = useState([]); // Define names state

    const db = SQLite.openDatabase('db.db');

    useEffect(() => {
        // Initialize the database

        // Create the table if not exists
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ingredients TEXT, instructions TEXT)');
        });

        // Fetch existing recipes
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM names', [], (_, { rows }) => {
                const data = rows._array;
                setNames(data);
                setIsLoading(false);
            });
        });

        // Close the database connection when component unmounts
       
    }, []);

    const handleStoreRecipe = () => {
        // Insert new recipe into the database
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO names (name, ingredients, instructions) VALUES (?, ?, ?)',
                [recipeName, ingredients, instructions],
                (_, { insertId }) => {
                    // Recipe inserted successfully
                    console.log('Recipe inserted with ID:', insertId);
                    // Refresh the recipes list
                    setNames([...names, { id: insertId, name: recipeName, ingredients, instructions }]);
                },
                (_, error) => console.error('Error inserting recipe:', error)
            );
        });

        // Show alert when recipe is created
        Alert.alert(
            'Recipe Created',
            'Your recipe has been successfully created!',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );

        // Vibrate the device
        Vibration.vibrate();
    };

    const instructions2 = { AppInstructions: 'When pressing the `create recipe ` button your recipe is stored in the database and can be viewed on the current recipe page' };

    return (
        <ImageBackground
            source={require('./images/background2.png')}
            style={styles.backgroundImage}
        >
            <View style={{ alignItems: 'center', backgroundColor: '#C7C7C7', borderRadius: 12, top: -100 }}>
                <TextInput
                    style={{ height: 40, borderColor: 'purple', borderWidth: 2, marginBottom: 10, width: 300, borderRadius: 5, backgroundColor: 'white' }}
                    placeholder="Recipe Name"
                    onChangeText={setRecipeName}
                    value={recipeName}
                />
                <TextInput
                    style={{ height: 80, borderColor: 'purple', borderWidth: 2, marginBottom: 10, width: 300, borderRadius: 5, backgroundColor: 'white' }}
                    placeholder="Ingredients"
                    multiline
                    onChangeText={setIngredients}
                    value={ingredients}
                />
                <TextInput
                    style={{ height: 140, borderColor: 'purple', borderWidth: 2, marginBottom: 10, width: 300, borderRadius: 5, backgroundColor: 'white' }}
                    placeholder="Instructions"
                    multiline
                    onChangeText={setInstructions}
                    value={instructions}
                />

                <Button title="Create Recipe" onPress={handleStoreRecipe} />
            </View>

            <Text style={{ textAlign: 'center', marginBottom: '', fontSize: 20, top: '-30', color: '#9C2197', fontWeight: '600' }}>{instructions2.AppInstructions}</Text>
        </ImageBackground>
    );
};

const Reference = ({ navigation }) => {

    return (
        <View>
            <Text>External Reference Page</Text>
        </View>
    );
};


export default function App() {
    const [names, setNames] = useState([]);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="startup">
                <Stack.Screen name="startup" component={Homescreen} />
                <Stack.Screen name="select" component={Selectpage} />
                <Stack.Screen
                    name="currentR"
                    component={CurrentRecipes}
                    initialParams={{ names: names }}
                />
                <Stack.Screen name="CreateNew">
                    {(props) => <CreateNewRecipe {...props} setNames={setNames} />}
                </Stack.Screen>
                <Stack.Screen name="references" component={Reference} />
            </Stack.Navigator>
        </NavigationContainer>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage2: {
        flex: 1,
        resizeMode: 'cover',
        


    }
   
});

