import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  StatusBar,
  Text,
  View,
} from 'react-native';

import loadingStyles from './loadingStyles';

const UPDATE_INTERVAL = 1000; // 1 sec

class Loading extends React.Component {
  static navigationOptions = {
    title: 'Loading...',
  };
  constructor(props) {
    super(props);
    this.state = {
      loadingBackground: require('../images/radar_200.png'),
      loadingTopImage: require('../images/ripple_200.gif'),
      progress: 0,
      timePassed: 0,
    };
    this.checkProgress = this.checkProgress.bind(this);
  }

  componentDidMount() {
    this.next = setInterval(this.checkProgress, UPDATE_INTERVAL);
  }

  checkProgress() {
    const { navigate } = this.props.navigation;
    const monsterIndex = this.props.navigation.getParam('monsterIndex', 0);
    const totalTime = 5000; // we want to transition (faking our api call) after 5 sec
    const timePassed = this.state.timePassed + UPDATE_INTERVAL;
    const progress = timePassed / totalTime;
    this.setState({
      timePassed,
      progress,
    });
    if (timePassed == totalTime) {
      clearInterval(this.next); // only way to reliably clear interval before navigate away
      navigate('Monster', { monsterIndex: monsterIndex });
    }
  }

  componentWillUnmount() {
    clearInterval(this.next);
  }

  render() {
    const { navigation } = this.props;
    const { loadingBackground, loadingTopImage } = this.state;
    const zipcode = navigation.getParam('zipcodeEntry', 'NO ZIPCODE');
    return (
      <View style={[loadingStyles.view, loadingStyles.containerColor]}>
        <StatusBar translucent={false} barStyle="light-content" />
        <View style={loadingStyles.content}>
          <Text style={loadingStyles.text}>Checking nearby faults and known monster sightings around {zipcode}...</Text>
          <ImageBackground
            source={loadingBackground}
            style={loadingStyles.backgroundImage}
            resizeMode='contain'
          >
            <Image
              source={loadingTopImage}
              style={loadingStyles.topImage}
              resizeMode='contain'
            />
          </ImageBackground>
          {Platform.OS == 'android' && <ProgressBarAndroid progress={this.state.progress} styleAttr="Horizontal" />}
          {Platform.OS == 'ios' && <ProgressViewIOS progress={this.state.progress} progressViewStyle="bar" />}
        </View>
      </View>
    );
  }
}

export default Loading;