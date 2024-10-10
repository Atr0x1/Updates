import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { hp, stripHtmlTags, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHtml from 'react-native-render-html';
import { Image } from 'expo-image'
import { downloadFile, getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'
import {  createPostLikes, removePostLike } from '../services/postService'
import Loading from './Loading'
import * as Sharing from 'expo-sharing';

const textStyle ={
     color: theme.colors.dark,
    fontSize: hp(1.75)
    
};
const tagsStyles ={
    div: textStyle,
    p: textStyle,
    ol:textStyle,
    h1:{
        color:theme.colors.dark
    },
    h4:{
        color:theme.colors.dark
    }
}
const PostCard = ({
    item,
    currentUser,
    router, 
    hasShadow = true,
    showMoreIcon = true,
    showDelete= false,
    onDelete=()=>{},
    onEdit=()=>{}
    
}) => {
    const shadowStyles={
        shadowOffset:{
            width: 0,
            height: 2
        },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 1
    }
    const [likes, setLikes] =  useState([]);
    const [loading, setLoading] = useState(false);
  useEffect(()=>{
    setLikes(item?.postLikes);

  },[])
    const openPostDetails =()=>{
        //WAIT BALIKAN KITA HA
        if(!showMoreIcon) return null;
        router.push({pathname:'postDetails',params:{postId:item?.id}})
    }
    const onLike = async ()=>{
        if(liked){
           let updateLikes = likes.filter(like=> like.userId!=currentUser?.id);
           setLikes([...updateLikes])
           let res = await removePostLike(item?.id, currentUser?.id);
           console.log('remove like:', res); 
           if(!res.success){
            Alert.alert('Post', 'Something went wrong!')
           }
         
           
        }else{
            let data ={
                userId: currentUser?.id,
                postId: item?.id
           }
           setLikes([...likes,data])
           let res = await createPostLikes(data);
           console.log('added like  :', res);
           if(!res.success){
            Alert.alert('Post', 'Something went wrong!')
           }
         }
           
        }
       
        const onShare = async () => {
            setLoading(true);  // Start loading
        
            let content = { message: stripHtmlTags(item?.body) };
        
            try {
                if (item?.file) {
                    // Get the file URL from Supabase
                    const fileUrl = getSupabaseFileUrl(item?.file)?.uri;
        
                    // Download the file locally
                    const downloadedFilePath = await downloadFile(fileUrl);
        
                    if (downloadedFilePath) {
                        // Use Expo Sharing if it's available
                        if (await Sharing.isAvailableAsync()) {
                            try {
                                await Sharing.shareAsync(downloadedFilePath, {
                                    dialogTitle: 'Share Post',
                                    mimeType: item?.file?.includes('postImages') ? 'image/png' : 'video/mp4'
                                });
                            } catch (error) {
                                Alert.alert('Post', 'Error sharing post');
                                console.error('Error sharing:', error);
                            }
                        } else {
                            console.log('Sharing is not available on this platform');
                        }
                    } else {
                        console.error('Failed to download media file');
                    }
                } else {
                    // Share only the text if there's no file
                    await Share.share(content);
                }
            } catch (error) {
                Alert.alert('Post', 'Error during share operation');
                console.error('Error during sharing:', error);
            } finally {
                setLoading(false);  // Stop loading after all operations are done
            }
        };
        const handlePostDelete = ()=>{
            Alert.alert('Confirm', "Are you sure you want do this?", [
                {
                    text: 'Cancel',
                    onPress: () => console.log('modal cancelled'),
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => onDelete(item), // Call the onLogout function
                    style: 'destructive'
                }
            ]);
        }
      //  console.log('post item comments:', item?.comments);
    const createdAt = moment(item?.created_at).format('MMM D');
    const liked = likes.filter(like=> like.userId==currentUser?.id)[0]? true:false;
    
    
    //console.log('post item:',item);

    // console.log('post item::', item)
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <View style = {styles.userInfo}>
            <Avatar
                size={hp(4.5)}
                uri = {item?.user?.image}
                rounded= {theme.radius.md}
                />
                <View style={{gap:2}}>
                    <Text  style={styles.username}>{item?.user?.name}</Text>
                    <Text  style={styles.postTime}>{createdAt}</Text>
                </View>
        </View>
        {
            showMoreIcon &&(
                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name = "threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text}/>
                </TouchableOpacity>
            )
        }

        {
            showDelete && currentUser.id == item?.userId && (
                <View style ={styles.actions}>
                    <TouchableOpacity onPress={()=> onEdit(item)}>
                        <Icon name = "edit" size={hp(2.5)}  color={theme.colors.text}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePostDelete }>
                        <Icon name = "delete" size={hp(2.5)}  color={theme.colors.rose}/>
                    </TouchableOpacity>
                </View>
            )
        }
        
      </View>
      {/* Post part na to */}
      <View  style={styles.content}>
        <View style={styles.postBody}>
            
                {
                    item?.body && (
                        <RenderHtml
                        contentWidth={wp(100)}
                        source={{html: item?.body}}
                        tagsStyles={tagsStyles}
                    />
                    )
                }
            
        </View> 

        {/* show the image part */}
        {
            item?.file && item?.file?.includes('postImages') && (
                <Image
                source={getSupabaseFileUrl(item?.file)}
                transition={100}
                style={styles.postMedia}
                contentFit='cover'
                />
            )
        }
        {/* show video part naman here */}
        {
            item?.file && item?.file?.includes('postVideos') && (
                <Video
                style={[styles.postMedia, {height:hp(30)}]}
                source= {getSupabaseFileUrl(item?.file)}
                useNativeControls
                resizeMode='cover'
                isLooping
                />
            )
        }
      </View>
      {/* interaction part na to */}
      <View  style = {styles.footer}>
        <View style = {styles.footerButton}>
            <TouchableOpacity onPress={onLike}>
                <Icon name='heart' size={24} fill={liked? theme.colors.rose: 'transparent'}color={liked? theme.colors.rose: theme.colors.textLight}/>
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                  likes?.length
                }
            </Text>

        </View>
        <View style = {styles.footerButton}>
            <TouchableOpacity onPress={openPostDetails}>
                <Icon name='comment' size={24} color={theme.colors.textLight}/>
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                    
                    item?.comments[0]?.count
                }
            </Text>

        </View>
        <View style = {styles.footerButton}>
            {
                loading?(
                    <Loading size="small"/>
                ):(
                    <TouchableOpacity onPress={onShare}>
                    <Icon name='share' size={24} color={theme.colors.textLight}/>
                </TouchableOpacity>
                )
            }
           
            
        </View>
      </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    
container: { 
    gap: 10,
    marginBottom: 15,
    borderRadius: theme. radius.xxl*1.1,
    borderCurve: 'continuous',
    padding: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: '#000'
}, 
header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
},
userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
},
username: { 
    fontSize: hp(1.7),
    color: theme.colors.textDark, 
fontWeight: theme.fonts.medium,
},
postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight, 
    fontWeight: theme.fonts.medium,
},
content: {
    gap: 10,
// marginBottom: 10,
},
postMedia: {
    height: hp(40),
    width: '100%',
    borderRadius: theme.radius.xl, borderCurve: 'continuous'
},
postBody: { 
    marginLeft: 5,
},
footer: {
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 15
},

footerButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
},
actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,

},
count: {
    color: theme.colors.text, 
    fontSize: hp(1.8)
}

})