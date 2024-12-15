import React, { useEffect, useState } from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

export const AddComment = ({ id }) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const onAddCommentHandler = async () => {
    try {
      setCommentText('');

      await axios.post(`/posts/${id}/comments`, { text: commentText });

      navigate('/');
    } catch (error) {
      console.log(error);

      alert('Failed to create new comment');
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src="https://mui.com/static/images/avatar/5.jpg"
        />
        <div className={styles.form}>
          <TextField
            label="Write a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button onClick={onAddCommentHandler} variant="contained">
            Send
          </Button>
        </div>
      </div>
    </>
  );
};
