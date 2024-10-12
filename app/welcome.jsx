import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { wp , hp} from '../helpers/common'
import { StatusBar } from 'expo-status-bar'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg ="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
            {/* Welcome Image */}
        <Image
          style={styles.welcomeImage} 
          resizeMode='contain' 
          source={require('../assets/images/front.png')}
        />
         {/* Title and Punchline */}
         <View style={styles.textContainer}>
          <Text style={styles.title}>Get Started!</Text>
          <Text style={styles.punchLine}>Suntukan na lang oh!!!</Text>
        </View>
        <View style={styles.footer}>
          <Button
          title="Getting Started"
          buttonStyle={{marginHorizontal: wp(3)}}
          onPress={()=> router.push('signUp')}
          />
          <View style={styles.bottonTextContainer}>
            <Text style = {styles.loginText}>
              Already have an account!
            </Text>
            <Pressable onPress={()=> router.push('login')}>
              <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight:theme.fonts.semibold}]}>
                Login
              </Text>
            </Pressable>
          </View>
        </View>
        
        
        
        </View>
    
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems:'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal: wp(4)
  },
  welcomeImage: {
    height: hp(50),
    width: wp(100),
    alignSelf: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: theme.fonts.extraBold,
  },
  punchLine: {
    textAlign: 'center',
    fontSize: hp(1.7),
    color: theme.colors.text,
    marginTop: hp(2),  // Adjust spacing between title and punchline
  },
  footer:{
    marginTop: hp(10),
    gap:30,
    width: '100%'
  },
  bottonTextContainer:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  loginText:{
    textAlign: 'center',
    color:theme.colors.text,
    fontSize: hp(1.6)
  },
})