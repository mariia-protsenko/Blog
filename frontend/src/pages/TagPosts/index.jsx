import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import defaultPostPicture from '../../assets/img/default-post-picture2.png';

import styles from './TagPosts.module.scss';
import axios from '../../axios';
import { Post } from '../../components';

export const TagPosts = () => {
  const { tag } = useParams();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userData = useSelector((state) => state.auth.data);

  const isPostsLoading = posts.status === 'loading';

  useEffect(() => {
    axios
      .get(`/tags/${tag}`)
      .then((res) => {
        setPosts(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert('Error while fetching posts with needed tag');
      });
  }, [tag]);

  if (isLoading) {
    return <Post isLoading isFullPost />;
  }

  return (
    <>
      <Typography variant="h4" classes={{ root: styles.title }}>
        # {tag}
      </Typography>
      <Grid classes={{ root: styles.posts }} container spacing={{ xs: 2, md: 3 }}>
        {(isPostsLoading ? [...Array(5)] : posts).map((post, index) =>
          isPostsLoading ? (
            <Grid key={index} xs={10} md={4} item>
              <Post isLoading={true} />
            </Grid>
          ) : (
            <Grid key={index} xs={10} md={4} item>
              <Post
                id={post._id}
                title={post.title}
                imageUrl={
                  post.imageUrl ? `http://localhost:5555${post.imageUrl}` : defaultPostPicture
                }
                user={post.user}
                createdAt={post.createdAt}
                viewsCount={post.viewsCount}
                commentsCount={3}
                tags={post.tags}
                isEditable={userData?._id === post.user._id}
              />
            </Grid>
          ),
        )}
      </Grid>
    </>
  );
};
