import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ArrowLeft from './ArrowLeft'
import { theme } from '../../constants/theme'
import Add from './Add'
import Call from './Call'
import Camera from './Camera'
import Comment from './Comment'
import Delete from './Delete'
import Edit from './Edit'
import Heart from './Heart'
import Image from './Image'
import Location from './Location'
import Lock from './Lock'
import Logout from './Logout'
import Mail from './Mail'
import Search from './Search'
import Send from './Send'
import Share from './Share'
import User from './User'
import Video from './Video'
import ThreeDotsCircle from './ThreeDotsCircle'
import ThreeDotsHorizontal from './ThreeDotsHorizontal'



const icons= {
    arrowLeft:ArrowLeft,
    add:Add,
    call:Call,
    camera:Camera,
    comment:Comment,
    delete:Delete,
    edit:Edit,
    heart:Heart,
    image:Image,
    location:Location,
    lock:Lock,
    logout:Logout,
    mail:Mail,
    search:Search,
    send:Send,
    share:Share,
    user:User,
    video:Video,
    threeDotsCircle:ThreeDotsCircle,
    threeDotsHorizontal:ThreeDotsHorizontal



}
const Icon =({name, ...props})=>{
    const IconComponent = icons[name];

  return (
    <IconComponent
    height={props.size || 24}
    width={props.size || 24}
    strokeWidth={props.strokeWidth || 1.9}
    color={theme.colors.text}
    {...props}
    />
  )
}

export default Icon

