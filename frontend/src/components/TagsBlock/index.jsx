import React, { memo } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

import styles from './TagsBlock.module.scss';
import { SideBlock } from '../SideBlock';
import { Link } from 'react-router-dom';

export const TagsBlock = memo(({ items, isLoading = true }) => {
  const uniqueItems = [...new Set(items)];

  return (
    <div className={styles.tags}>
      <SideBlock title="Tags">
        <List>
          {(isLoading ? [...Array(5)] : uniqueItems).map((name, i) => (
            <Link key={i} style={{ textDecoration: 'none', color: 'black' }} to={`/tags/${name}`}>
              <ListItem key={i} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <TagIcon />
                  </ListItemIcon>
                  {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name} />}
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </SideBlock>
    </div>
  );
});
