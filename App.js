/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  UIManager,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {AccordionList} from 'react-native-accordion-list-view';
import {MaterialIndicator} from 'react-native-indicators';

const App = () => {
  const [postofficeList, setPostofficeList] = useState([]);
  const [loaderShow, setLoaderShow] = useState('');
  const [dataStatus, setDataStatus] = useState('');
  const [cityName, setCityName] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [status, setStatus] = useState('');
  let timeoutId;
  const onChangeText = useCallback(input => {
    setCityName(input);
    setLoaderShow(true);
    clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    timeoutId = setTimeout(() => {
      setDebouncedText(input);
    }, 1000);
  }, []);
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/postoffice/${debouncedText}`,
        );
        console.log(response.data);
        setStatus(response.data[0].Status);
        setDataStatus(response.data[0].Message);
        setPostofficeList(response.data[0].PostOffice);
        setLoaderShow(false);
      } catch (error) {
        console.error(error, 'error');
      }
    }
    fetchData();
  }, [debouncedText]);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.placeField}
        placeholder="Enter City name here"
        onChangeText={onChangeText}
        value={cityName}
      />
      <Text style={styles.statusLine}>{dataStatus}</Text>
      {status === 'Success' ? (
        <AccordionList
          data={postofficeList}
          customTitle={item => <Text>{item.Name}</Text>}
          customBody={item => (
            <View style={styles.accordionView}>
              <Text style={styles.textView}> Name: {item.Name}</Text>
              <Text style={styles.textView}>
                {' '}
                Branch Type: {item.BranchType}
              </Text>
              <Text style={styles.textView}> State: {item.State}</Text>
              <Text style={styles.textView}> Pincode: {item.Pincode}</Text>
            </View>
          )}
          animationDuration={400}
        />
      ) : (
        <View style={styles.container}>
          {loaderShow ? <MaterialIndicator color="black" /> : <View />}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeField: {height: 40, borderColor: 'gray', borderWidth: 1, margin: 5},
  statusLine: {margin: 5},
  accordionView: {
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  textView: {margin: 5},
});

export default App;
