import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../Avatar';
import { hp } from '../../helpers/common';
import { useRouter } from 'expo-router';


const Header = () => {
    const { user, setAuth } = useAuth();
    const router  = useRouter()
  return (
    <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
    }}>
        <View> 
        <Text style={{
            fontFamily: 'regular',
            fontSize: 17
        }}>Welcome,</Text>
        <Text style={{
            fontFamily: 'medium',
            fontSize: 25
        }}>{user && user.name}</Text>
        </View>
        <Pressable onPress={()=> router.push('profile')}>
        <Avatar
             uri={user?.image} // Using optional chaining to avoid errors
             style={{
                width: 40,
                height: 40
             }}
            />
        </Pressable>
      
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})