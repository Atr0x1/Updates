import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import { wp, hp } from '../../helpers/common'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'

var limit = 0;
const Profile = () => {
    
    
    const { user, setAuth } = useAuth(); // Get user and setAuth from context
    const router = useRouter(); // Get the router object
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const getPosts = async () =>{
        //call the api here
        if(!hasMore) return null;
        limit = limit + 10;
        
        console.log('fetching posts:', limit);
        let res = await fetchPosts(limit, user.id);
        if(res.success){
          if(posts.length == res.data.length) setHasMore(false);
          setPosts(res.data);
        }
        //console.log('got posts results:', res);
       // console.log('user:', res.data[0].user)
      }

    const onLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign out', "Error signing out!"); // Alert on sign out error
        }
    };

    const handleLogout = async () => {
        Alert.alert('Confirm', "Are you sure you want to log out?", [
            {
                text: 'Cancel',
                onPress: () => console.log('modal cancelled'),
                style: 'cancel'
            },
            {
                text: 'Logout',
                onPress: () => onLogout(), // Call the onLogout function
                style: 'destructive'
            }
        ]);
    };

    return (
        <ScreenWrapper bg='white'>
            {/* Update: Correctly passing router prop */}
            <FlatList
                data={posts}
                ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout} />}
                ListHeaderComponentStyle={{marginBottom: 30}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listStyle}
                keyExtractor={item=> item.id.toString()}
                renderItem={({item})=> <PostCard
                    item={item}
                    currentUser={user}
                    router={router}
                 />
                }

                onEndReached={()=>{
                getPosts();
                //console.log('got to the end');
                }}
                onEndReachedThreshold={0}

                ListFooterComponent={hasMore?(
                <View style={{marginVertical: posts.length == 0? 100: 30}}>
                    <Loading/>
                    </View>
                ):(
                <View style={{marginVertical: 30}}>
                    <Text style = {styles.noPosts}>No more posts</Text>
                    </View>
                )}

            />
        </ScreenWrapper>
    );
};

// UserHeader component to display user information
const UserHeader = ({ user, router, handleLogout }) => {
    // Debug log to check if router is defined
    //console.log('Router:', router); // Log the router object for debugging

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
            <View>
                <Header title="Profile" mb={30} />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="logout" color={theme.colors.rose} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={{ gap: 15 }}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            uri={user?.image} // Using optional chaining to avoid errors
                            size={hp(12)}
                            rounded={theme.radius.xxl * 1.4}
                        />
                        {/* Update: Ensure correct use of router to navigate */}
                        <Pressable style={styles.editIcon} onPress={() => router.push('editProfile')}>
                            <Icon name="edit" strokeWidth={2} size={20} />
                        </Pressable>
                    </View>
                    {/* username and address */}
                    <View style={{ alignItems: 'center', gap: 4 }}>
                        <Text style={styles.userName}>{user && user.name}</Text>
                        <Text style={styles.infoText}>{user && user.address}</Text>
                    </View>
                    {/* email, phone, bio */}
                    <View style={{ gap: 10 }}>
                        <View style={styles.info}>
                            <Icon name="mail" size={20} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>
                                {user && user.email}
                            </Text>
                        </View>
                        {user && user.phoneNumber && ( // Check if phoneNumber exists
                            <View style={{ gap: 10 }}>
                                <View style={styles.info}>
                                    <Icon name="call" size={20} color={theme.colors.textLight} />
                                    <Text style={styles.infoText}>
                                        {user && user.phoneNumber}
                                    </Text>
                                </View>
                            </View>
                        )}
                        {user && user.bio && ( // Check if bio exists
                            <Text style={styles.infoText}>{user.bio}</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: 'center',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    userName: {
        fontSize: hp(3),
        fontWeight: '500',
        color: theme.colors.textDark
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: '500',
        color: theme.colors.textLight
    },
    logoutButton: {
        position: 'absolute',
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fee2e2'
    },
    noPosts:{
        fontSize: hp(2),
        textAlign:'center',
        color: theme.colors.text
    }
});
