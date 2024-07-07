// src/pages/FeedPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, TextField } from '@mui/material';

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(firestore, 'posts'));
        const postsSnapshot = await getDocs(postsQuery);
        setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    try {
      const postDoc = doc(firestore, 'posts', postId);
      const postSnapshot = await getDoc(postDoc);
      const postData = postSnapshot.data();
      if (!postData) return;

      const updatedLikes = (postData.likes || []).includes(currentUser.uid)
        ? (postData.likes || []).filter((uid: string) => uid !== currentUser.uid)
        : [...(postData.likes || []), currentUser.uid];

      await updateDoc(postDoc, { likes: updatedLikes });
      setPosts(posts.map(post => (post.id === postId ? { ...post, likes: updatedLikes } : post)));
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!currentUser || !newComment) return;

    try {
      const postDoc = doc(firestore, 'posts', postId);
      const postSnapshot = await getDoc(postDoc);
      const postData = postSnapshot.data();
      if (!postData) return;

      const updatedComments = [...(postData.comments || []), { uid: currentUser.uid, comment: newComment }];

      await updateDoc(postDoc, { comments: updatedComments });
      setPosts(posts.map(post => (post.id === postId ? { ...post, comments: updatedComments } : post)));
      setNewComment('');
      setSelectedPostId(null);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleSave = async (postId: string) => {
    if (!currentUser) return;

    try {
      const userDoc = doc(firestore, 'users', currentUser.uid);
      const userSnapshot = await getDoc(userDoc);
      const userData = userSnapshot.data();
      if (!userData) return;

      const updatedSavedPosts = (userData.savedPosts || []).includes(postId)
        ? (userData.savedPosts || []).filter((id: string) => id !== postId)
        : [...(userData.savedPosts || []), postId];

      await updateDoc(userDoc, { savedPosts: updatedSavedPosts });
    } catch (error) {
      console.error("Error saving post: ", error);
    }
  };

  return (
    <Container sx={{ marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>
        Feed
      </Typography>
      <Grid container spacing={3}>
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card>
                <CardMedia component="img" height="200" image={post.imageUrl} alt="Post image" />
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="body1">{post.caption}</Typography>
                  <Typography variant="body2" color="textSecondary">{post.email}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {(post.likes || []).length} likes
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleLike(post.id)}
                  >
                    {(post.likes || []).includes(currentUser?.uid) ? 'Unlike' : 'Like'}
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => handleSave(post.id)}>
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    Comment
                  </Button>
                  {selectedPostId === post.id && (
                    <div>
                      <TextField
                        label="Comment"
                        fullWidth
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleComment(post.id)}
                      >
                        Add Comment
                      </Button>
                    </div>
                  )}
                  <div>
                    {(post.comments || []).map((comment: any, index: number) => (
                      <Typography key={index} variant="body2">
                        {comment.comment}
                      </Typography>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No posts available</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default FeedPage;
