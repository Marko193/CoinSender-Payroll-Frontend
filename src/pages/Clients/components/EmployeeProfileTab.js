import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Stack, Grid, Box } from '@mui/material';
import ProfileLeftSide from './ProfileLeftSide';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const BlockWrapper = styled(Box)({
  boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
});

const CustomDivider = styled(Divider)({
  margin: '10px 0',
});

export default function EmployeeProfileTab({ user, params }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Grid container spacing={2}>
        <ProfileLeftSide user={user} />
        <Grid item xs={12} md={6} lg={8}>
          <BlockWrapper
            sx={{
              paddingX: 4,
              paddingY: 4,
              mb: 3,
            }}
          >
            Email: {user?.email || 'No data...'}
            <CustomDivider />
            Phone: {user?.phone || 'No data...'}
            <CustomDivider />
            Additional information: {user?.description || 'No data...'}
          </BlockWrapper>
        </Grid>
      </Grid>
    </Stack>
  );
}
