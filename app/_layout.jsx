import { LogBox, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react' 
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'
import {useFonts } from "expo-font"

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer','Warning: TRenderEngineProvider'])
const _layout =()=>{
  return (
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  )
}
const MainLayout = () => {
  const { setAuth,setUserData } = useAuth();
  const router = useRouter();

  useFonts({
    'regular':require('./../assets/fonts/LTSaeada-Regular.otf'),
    'medium':require('./../assets/fonts/LTSaeada-Medium.otf'),
    'bold':require('./../assets/fonts/LTSaeada-Bold.otf'),
  })

  useEffect(()=>{
    
    supabase.auth.onAuthStateChange((_event, session) => {
      //console.log('session user:', session?.user?.id);

      if(session){
        //set auth
      setAuth(session?.user);
      updatedUserData(session?.user, session?.user?.email);
    
      router.replace('/(tabs)/home')
        //move to home scree
    }else{
        //set auth null
     setAuth(null);
    router.replace('/welcome')
     //   //move to welcome screen
   }
  })
      
  },[]);
  const updatedUserData = async (user, email) =>{
    let res = await getUserData(user?.id);
    if(res.success) setUserData({...res.data, email});

  }
  return (
    
<Stack
  screenOptions={{
  headerShown: false
}}
>
<Stack.Screen
      name="(main)/postDetails"
      options={{
      presentation: 'modal'
  }}
/>
</Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})