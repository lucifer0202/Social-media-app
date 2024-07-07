// src/pages/MyPostsPage.tsx
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

const MyPostsPage: React.FC = () => {
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!currentUser) return;

      const postsQuery = query(collection(firestore, 'posts'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(postsQuery);
      setMyPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchMyPosts();
  }, [currentUser]);

  const handleDelete = async (postId: string) => {
    await deleteDoc(doc(firestore, 'posts', postId));
    setMyPosts(myPosts.filter(post => post.id !== postId));
  };

  return (
    <Container sx={{ marginTop: 8 }}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Posts
        </Typography>
        <Grid container spacing={3}>
          {myPosts && myPosts.length > 0 ? (
            myPosts.map(post => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card>
                  <CardMedia component="img" height="200" image={post.imageUrl} alt="Post image" />
                  <CardContent>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body1">{post.caption}</Typography>
                    <Typography variant="body2" color="textSecondary">{post.email}</Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(post.id)}>
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1">No posts available</Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default MyPostsPage;
