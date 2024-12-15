import React, { useEffect, useState } from 'react';

import { Post } from '../components/Post';
import { AddComment } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import axios from '../axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostComments } from '../redux/slices/comments';

export const FullPost = () => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments);

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchPostComments(id));

    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        alert('Error while fetching post');
      });
  }, []);

  if (isLoading) {
    return <Post isLoading isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:5555${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments.items.map((comment) => {
          return {
            user: {
              fullName: comment.user.fullName,
              avatarUrl: comment.user.avatarUrl,
            },
            text: comment.text,
          };
        })}
        isLoading={false}>
        <AddComment id={id} />
      </CommentsBlock>
    </>
  );
};
