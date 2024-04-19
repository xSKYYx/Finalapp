import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Alert, Vibration, Platform, ImageBackground, ActivityIndicator, TouchableOpacity, Linking, ScrollView } from 'react-native';
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
    const About = () => { navigation.navigate('about'); };
    return (
        <ImageBackground
            source={require('./images/background.png')}
            style={styles.backgroundImage}
        >


            <View style={styles.container}>
                <Text style={{ fontSize: 30, marginBottom: 40, fontWeight: '900', marginTop: 120 }}>PLEASE SELECT</Text>

                <View style={{ backgroundColor: '#A60D94', width: 350, height: 75, borderRadius: 10, marginBottom: 17, justifyContent: 'center' }}>
                    <Button title="Current Recipes" onPress={CurrentRecipe} color="#13F2DF" />
            </View>
                <View style={{ backgroundColor: '#A60D94', width: 350, height: 75, borderRadius: 10, marginBottom: 17, justifyContent: 'center' }}>
                    <Button title="Create Recipe" onPress={CreateNew} color="#13F2DF"/>
            </View>
                <View style={{ backgroundColor: '#A60D94', width: 350, height: 75, borderRadius: 10, marginBottom: 17, justifyContent: 'center' }}>
                    <Button title="Online References" onPress={Reference} color="#13F2DF"/>
                </View>

                <View style={{ backgroundColor: '#A60D94', width: 350, height: 75, borderRadius: 10, marginBottom: 17, justifyContent: 'center' }}>
                    <Button title="About" onPress={About} color="#13F2DF" />
                </View>

            </View>
        </ImageBackground>
    );
};

const CurrentRecipes = ({ navigation }) => {
    const [setNames] = useState([]);
    const { names } = navigation.navigate

    const TextDisplay = ({ label, value }) => {
        return (
            <View style={''}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        );
    };


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
        //these are examples of how it could or was suppost to look like when the data is pass through one page to this one page within this view.
        <ImageBackground source={require('./images/background2.png')} style={styles.backgroundImage2}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.box}>
                <TextDisplay label="Name:" value="chocolate chip cookies" />
                <TextDisplay label="Ingredients:" value="flours, eggs, salt, butter, baking soda, choco chips, vanilla abstract." />
                <TextDisplay label="Instructions:" value="1: mix all the ingredients in a orderly fashion. 2: mix well until it is doe, and then put in oven for 12 mins, let it set for 4 mins, and then enjoy" />

            </View>
            <View style={styles.box}>
                <TextDisplay label="Name:" value="chocolate chip cookies" />
                <TextDisplay label="Ingredients:" value="flours, eggs, salt, butter, baking soda, choco chips, vanilla abstract." />
                <TextDisplay label="Instructions:" value="1: mix all the ingredients in a orderly fashion. 2: mix well until it is doe, and then put in oven for 12 mins, let it set for 4 mins, and then enjoy" />

            </View>
            <View style={styles.box}>
                <TextDisplay label="Name:" value="example" />
                <TextDisplay label="Ingredients:" value="example" />
                <TextDisplay label="Instructions:" value=" example" />

            </View>
            <View style={styles.box}>
                <TextDisplay label="Name:" value="example" />
                <TextDisplay label="Ingredients:" value="example." />
                <TextDisplay label="Instructions:" value="example" />
            </View>


                <View style={styles.box}>
              {showRecipe()}
            </View>

            </ScrollView>
        </ImageBackground>
    );
};

const CreateNewRecipe = ({ navigation, setNames }) => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const db = SQLite.openDatabase('db.db');

    const handleStoreRecipe = () => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO names (name, ingredients, instructions) VALUES (?, ?, ?)',
                [recipeName, ingredients, instructions],
                (_, { insertId }) => {
                    console.log('Recipe inserted with ID:', insertId);
                    const newRecipe = { id: insertId, name: recipeName, ingredients, instructions };
                    setNames([...names, newRecipe]); // Update the state with the new recipe
                },
                (_, error) => console.error('Error inserting recipe:', error)
            );
        });

        Alert.alert(
            'Recipe Created',
            'Your recipe has been successfully created!',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );

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

    const MyLink = ({ url, text }) => {
        const handlePress = () => {
            Linking.openURL(url);
        };
        return (
            <TouchableOpacity onPress={handlePress}>
                <Text style={{ color: 'blue' }}>{text}</Text>
            </TouchableOpacity>
        );
    };
    return (
        <ImageBackground
            source={require('./images/background2.png')}
            style={styles.backgroundImage}
        >
            <View>
                <Text style={{ top: '', fontSize: 30, fontWeight: '900', textDecorationLine: 'underline', color: 'blue', marginBottom: 10 }}>External Reference Page</Text>
                <Text style={{ top: '', fontSize: 15, fontWeight: '200', color: 'red', marginBottom: 10 }}>Below are links to websites that provide Recipe ideas</Text>

                <View style={styles.linkbox} >
                <View style={{ marginTop: '' }}>
                    <Text style={{ fontSize: 35, fontWeight: '800' }}>Pinterest:</Text>
                    <MyLink url="https://ca.pinterest.com/ideas/food-and-drink/918530398158/" text="LINK" />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 35, fontWeight: '800' }}>Allrecipes:</Text>
                    <MyLink url="https://www.allrecipes.com/" text="LINK" />
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 35, fontWeight: '800' }}>Simply RECIPES:</Text>
                    <MyLink url="https://www.simplyrecipes.com/" text="LINK" />
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 35,  fontWeight: '800' }}>epicurious:</Text>
                    <MyLink url="https://www.epicurious.com/m" text="LINK" />
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 35, fontWeight: '800' }}>Pinch of Yum:</Text>
                    <MyLink url="https://www.epicurious.com/m" text="LINK" />
                </View>
               </View>
            </View>
        </ImageBackground>
    );
};

const About = ({navigation}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>About Us</Text>
            <View style={styles.section}>
                <Text style={styles.subtitle}>App Developer (Lethbridge college CIT)</Text>
                <Text style={styles.text}>Skyler Black</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.subtitle}>Version</Text>
                <Text style={styles.text}>1.0.0</Text>
            </View>
        </View>
        )

}

export default function App() {
    const [names, setNames] = useState([]);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="startup">
                <Stack.Screen name="startup" component={Homescreen} />
                <Stack.Screen name="select" component={Selectpage} />
                <Stack.Screen name="currentR">
                    {(props) => <CurrentRecipes {...props} names={names} />}
                </Stack.Screen>

                <Stack.Screen name="CreateNew">
                    {(props) => <CreateNewRecipe {...props} setNames={names} />}
                </Stack.Screen>
                <Stack.Screen name="references" component={Reference} />

                <Stack.Screen name="about" component={About} />
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
        
        alignItems: 'center',
        justifyContent: 'center',

    },

    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    value: {
        fontSize: 13,
        color: '#666',
    },
    box: {
        borderWidth: 1,
        width: 200,
        height: 200,
        backgroundColor: 'white',
        borderRadius: 6,
        margin: 3
    },
   scrollContainer: {
        alignItems: 'center',
        paddingTop: 100,
       paddingBottom: 20,
        top: 30
    },

    linkbox: {
        borderWidth: 3,
        borderRadius: 12,
        backgroundColor: '#dcfce4',
        height: 500,


    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
    },

});

