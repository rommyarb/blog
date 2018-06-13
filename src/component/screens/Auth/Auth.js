import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, AsyncStorage, StatusBar } from "react-native";
import { CustomButton } from '../../common/index';
import { Actions } from 'react-native-router-flux';
import color from '../../../assets/color';

import { handleAuth } from "../../../store/actions";
import { connect } from 'react-redux'
import * as Progress from 'react-native-progress';

class AuthScreen extends React.Component {

  constructor(props) {
    super(props);
    Dimensions.addEventListener('change', this.updateMode);
    this.state = {
      loader_finished: false,
      viewMode: Dimensions.get('window').height > 500 ? 'potrait' : 'landscape',
      progress: 0,
      indeterminate: true,
    }
  }

  componentWillMount() {
    // checking user auth (session)
    this.props.handleAuth()
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateMode);
  }

  componentDidMount() {
    this.animate();
    StatusBar.setHidden(true);
  }

  animate() {
    setTimeout((function () {
      this.setState({
        loader_finished: true
      });
    }).bind(this), 800);
  }

  loginScreen = () => {
    Actions.login();
  }

  signUpScreen = () => {
    Actions.signUpScreen();
  }

  updateMode = (dims) => {
    this.setState({
      viewMode: dims.window.height > 500 ? 'potrait' : 'landscape'
    })
  }

  renderLoadingScreen = () => (
    <View style={styles.container}>
      <Image source={require('../../../assets/initial_back.png')}
        style={styles.backgroundImageStyle}

      />
      <View style={styles.mainContainer}>
        <View style={{
          width: '100%',
          height: '75%', alignItems: 'center', justifyContent: 'center'
        }}>
          <View style={styles.iconContainer}>
            <Image source={require('../../../assets/initial_icon.png')} style={styles.iconStyle} />
          </View>
          <Text style={styles.titleStyle}>Artisan's Story</Text>
        </View>
        <View style={{ height: '25%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Progress.Bar
            style={styles.progress}
            progress={this.state.progress}
            color={color.themeColor}
            unfilledColor={color.greyColor}
            borderWidth={0}
            indeterminate={this.state.indeterminate}
          />
        </View>
      </View>
    </View>
  );

  render() {
    if (this.state.loader_finished) {
      if (!this.props.userToken) {
        // load if user not logged in
        return (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={this.state.viewMode === 'potrait' ? styles.potraitLogoContainer : styles.landscapeLogoContainer}>
              <Text style={styles.titleStyle}><Text style={{ color: color.themeColor }}>Artisan's</Text> Story</Text>
            </View>
            <View style={this.state.viewMode === 'potrait' ? styles.potraitImageContainer : styles.landscapeImageContainer}>
              <Image
                style={this.state.viewMode === 'potrait' ? styles.potraitIconStyle : styles.landscapeIconStyle}
                source={require('../../../assets/icon.png')}
              />
            </View>
            <View style={this.state.viewMode === 'potrait' ? styles.potraitButtonContainer : styles.landscapeButtonContainer}>
              <View style={this.state.viewMode === 'potrait' ? styles.potraitButtonWrapper : styles.landscapeButtonWrapper}>
                <CustomButton
                  onPress={this.signUpScreen}
                  style={this.state.viewMode === 'potrait' ? styles.potraitSignUpButton : styles.landscapeSignUpButton}
                >
                  Sign Up
                            </CustomButton>
              </View>
              <View style={this.state.viewMode === 'potrait' ? styles.potraitButtonWrapper : styles.landscapeButtonWrapper}>
                <CustomButton
                  onPress={this.loginScreen}
                  buttonTextStyle={{ fontFamily: 'DancingScript-Bold', }}
                >
                  Login
                            </CustomButton>
              </View>
            </View>
          </View>
        );
      } else {
        return <this.renderLoadingScreen />
      }
    } else {
      return <this.renderLoadingScreen />
    }
  }
}

const styles = StyleSheet.create({
  potraitLogoContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  landscapeLogoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  potraitImageContainer: {
    flex: 1,
    marginTop: -100
  },
  landscapeImageContainer: {
    flex: 1,
    alignItems: 'center'
  },
  potraitButtonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapeButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 70,
    paddingRight: 70
  },
  potraitButtonWrapper: {
    alignItems: 'center',
    width: '100%'
  },
  landscapeButtonWrapper: {
    alignItems: 'center',
    width: '50%'
  },
  potraitSignUpButton: {
    marginBottom: 10,

  },
  landscapeSignUpButton: {

  },
  potraitIconStyle: {
    width: '100%',
    height: '100%'
  },
  landscapeIconStyle: {
    width: '45%',
    height: '100%'
  },
  potraitLogoStyle: {
    width: '100%',
    height: '20%',
    marginTop: 20
  },
  landscapeLogoStyle: {
    width: '50%',
    height: '50%'
  },
  titleStyle: {
    fontFamily: 'DancingScript-Bold',
    fontSize: 50,
    marginTop: 10,
    marginBottom: 10,
    color: color.fontColor
  },

  // LOADING SCREEN STYLES:
  container: {
    flex: 1
  },
  backgroundImageStyle: {
    height: '100%',
    width: '100%'
  },
  mainContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    height: 230,
    width: 230,
    marginTop: '20%'
  },
  iconStyle: {
    height: '100%',
    width: '100%'
  },
  progress: {
    width: '80%',
    marginTop: '20%',
  },
  titleStyle: {
    fontFamily: 'DancingScript-Bold',
    fontSize: 48,
    marginTop: 10,
    marginBottom: 10,
    color: '#323648'
  }
});

const mapStateToProps = (state) => {
  const { userToken } = state.auth
  return {
    userToken
  }
}

const mapDispatchTOProps = dispatch => {
  return {
    handleAuth: () => dispatch(handleAuth())
  }
}

export default connect(mapStateToProps, mapDispatchTOProps)(AuthScreen);