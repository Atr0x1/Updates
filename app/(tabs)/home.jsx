import { Alert, Button, FlatList, Pressable, StyleSheet, ScrollView, Text, View, RefreshControl} from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import {useAuth} from '../../contexts/AuthContext'
import {supabase} from '../../lib/supabase'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import { getUserData } from '../../services/userService'

var limit = 0;

const Home = () => {
  const {user, setAuth} = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getPosts(); // Fetch new posts when refreshing
      setRefreshing(false);
    }, 2000);
  }, []);

  // Handles real-time updates to posts (insert, update, delete)
  const handlePostEvent = async (payload) => {
    if (payload.eventType === 'INSERT' && payload?.new?.id) {
      let newPost = {...payload.new};
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{count: 0}];
      newPost.user = res.success ? res.data : {};
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
    if (payload.eventType === 'DELETE' && payload.old.id) {
      setPosts(prevPosts => prevPosts.filter(post => post.id != payload.old.id));
    }
    if (payload.eventType === 'UPDATE' && payload?.new?.id) {
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id == payload.new.id) {
          post.body = payload.new.body;
          post.file = payload.new.file;
        }
        return post;
      }));
    }
  };

  // Handles real-time updates to comments (insert)
  const handleCommentEvent = async (payload) => {
    if (payload.eventType === 'INSERT' && payload?.new?.postId) {
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === payload.new.postId) {
            post.comments = [{ count: post.comments[0].count + 1 }];
          }
          return post;
        });
      });
    }
  };

  // Handles real-time updates to likes (insert)
  const handleLikeEvent = async (payload) => {
    if (payload.eventType === 'INSERT' && payload?.new?.postId) {
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === payload.new.postId) {
            post.postLikes = [...post.postLikes, payload.new];
          }
          return post;
        });
      });
    }
  };

  useEffect(() => {
    // Subscribe to post, comment, and like events
    let postChannel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, handleCommentEvent)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, handleLikeEvent)
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 4;
    let res = await fetchPosts(limit);
    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Anong header?</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push('notifications')}>
              <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={() => router.push('newPost')}>
              <Icon name="add" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={() => router.push('profile')}>
              <Avatar 
                uri={user?.image}
                size={hp(4.3)} 
                rounded={theme.radius.sm} 
                style={{ borderWidth: 2}} 
              />
            </Pressable>
          </View>
        </View>
        {/* posts */}
        <FlatList 
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => 
            <PostCard
              item={item}
              currentUser={user}
              router={router}
            />
          }
          onEndReached={() => getPosts()}
          onEndReachedThreshold={0}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={hasMore ? (
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text style={styles.noPosts}>No more posts</Text>
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
});
