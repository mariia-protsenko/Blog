import React from 'react';

import { SideBlock } from '../SideBlock';
import styles from './CommentsBlock.module.scss';

import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  return (
    <div className={styles.comments}>
      <SideBlock title="Comments">
        <List>
          {(isLoading ? [...Array(5)] : items).map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar classes={{ root: styles.icon }}>
                  {isLoading ? (
                    <Skeleton classes={{ root: styles.avatar }} variant="circular" />
                  ) : (
                    <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Skeleton
                      classes={{ root: styles.user }}
                      variant="text"
                      height={25}
                      /*width={80}*/
                    />
                    <Skeleton
                      classes={{ root: styles.comment }}
                      variant="text"
                      height={18}
                      /*width={130}*/
                    />
                  </div>
                ) : (
                  <ListItemText primary={obj.user.fullName} secondary={obj.text} />
                )}
              </ListItem>
              <Divider classes={{ root: styles.divider }} variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>

        {children}
      </SideBlock>
    </div>
  );
};
