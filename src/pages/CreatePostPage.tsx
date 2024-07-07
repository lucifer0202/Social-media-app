// src/pages/CreatePostPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { firestore, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      console.error("User is not logged in");
      return;
    }

    let imageUrlToUse = imageUrl;

    if (imageFile) {
      const imageRef = ref(storage, `images/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrlToUse = await getDownloadURL(imageRef);
    }

    try {
      await addDoc(collection(firestore, 'posts'), {
        userId: currentUser.uid,
        email: currentUser.email,
        title: title,
        caption: caption,
        imageUrl: imageUrlToUse,
        likes: [],
        comments: [],
      });
      navigate('/myposts');
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Caption"
            fullWidth
            margin="normal"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
          <TextField
            label="Image URL"
            type="url"
            fullWidth
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Box sx={{ marginTop: 2 }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Post
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePostPage;
