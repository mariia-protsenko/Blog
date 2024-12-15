import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';

export const AddPost = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const inputFileRef = useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);

      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (error) {
      console.log(error);

      alert('Failed to upload file');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmitHandler = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.log(error);

      alert('Failed to create new post');
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setTags(data.tags.join(', '));
          setText(data.text);
          setImageUrl(data.imageUrl);
        })
        .catch((error) => {
          console.log(error);
          alert('Failed to get post');
        });
    }
  }, []);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '200px',
      autofocus: true,
      placeholder: 'Enter text here...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        style={{ marginRight: 5, marginBottom: 10 }}
        onClick={() => {
          inputFileRef.current.click();
        }}
        variant="outlined"
        size="large">
        Download preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button
            style={{ marginLeft: 5, marginBottom: 10 }}
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}>
            Delete
          </Button>
          <img className={styles.image} src={`http://localhost:5555${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={(e) => {
          setTags(e.target.value);
        }}
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmitHandler} size="large" variant="contained">
          {isEditing ? 'Save' : 'Post'}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
