/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AvatarUpload from '../../layouts/Avatar';
import Page from '../../components/Page';
import LeftIcon from '../../assets/icons/arrow-button-left.svg';
import { CLIENTS, EMPLOYEES } from '../../constants/routes';
import WarningModal from '../../components/WarningModal';
import { useDispatch, useSelector } from 'react-redux';
import { isAddress } from '@ethersproject/address';
import MuiPhoneNumber from 'material-ui-phone-number';
import { PageLayout } from 'src/layouts/PagesLayout';
import { PageTitle } from 'src/components/PageTitle';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const EditClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const params = useParams().id;
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
  };

  const client = useSelector(({ employees: { client, isLoading } }) => ({
    client,
    isLoading,
  }));
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => dispatch({ type: 'GET_CLIENT_BY_ID', id: params }), []);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    values,
    errors,
    getFieldProps,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: client?.client?.name && client?.client?.name,
      email: client?.client?.email && client?.client?.email,
      add_info: client.client?.description ? client.client.description : '',
      phone: client.client?.phone ? client.client.phone : '+380',
      avatar_url: client?.client?.avatar,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().max(15, 'Maximum length 15 characters').required('Is required'),
      add_info: Yup.string().max(15, 'Maximum length 15 characters'),
      email: Yup.string()
        .email('Email must be a valid email address')
        .required('Email is required'),
      phone: Yup.string().test(
        'isValid',
        'Phone is not valid',
        (val) => val === '+' || val === '+380' || isValidPhoneNumber(val),
      ),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('avatar', values.avatar ? values.avatar[0] : null);
      formData.append('name', values.name);
      formData.append('description', values.add_info ? values.add_info : '');
      formData.append('phone', values.phone === '+' || values.phone === '+380' ? '' : values.phone);
      formData.append('email', values.email);
      formData.append('organization_id', currentUser.organization_id);
      formData.append('id', client?.client?.id);
      !values.avatar && formData.append('avatar_url', null);
      dispatch({
        type: 'EDIT_CLIENT_SAGA',
        payload: formData,
        navigate,
        id: client.client.id,
        flag: 'edit',
      });
    },
  });

  return (
    <Page title="Edit Partner | CoinSender">
      <PageLayout>
        <WarningModal
          open={isOpen}
          type={`${CLIENTS}/${client?.client?.id}/profile`}
          close={handleClose}
        />
        {client.isLoading ? (
          'Loading...'
        ) : (
          <Stack>
            <PageTitle
              handler={() => setIsOpen(true)}
              title="Edit partner"
              path={`${CLIENTS}/${client.client?.id}/profile`}
            />
            <Grid container>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  padding: 3,
                  width: '100%',
                  boxShadow:
                    'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
                }}
                noValidate
                autoComplete="off"
              >
                <Stack direction="row" gap="20px">
                  <Stack width="50%" gap="16px">
                    <Stack direction="row" justifyContent="space-between">
                      <TextField
                        fullWidth
                        label={t('name')}
                        name="name"
                        required
                        value={values.name}
                        onChange={handleChange}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                      />
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <TextField
                        fullWidth
                        label={t('Email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                        name="email"
                        onBlur={handleBlur}
                        value={values.email}
                        onChange={handleChange}
                        required
                      />
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <MuiPhoneNumber
                        fullWidth
                        variant="outlined"
                        label="Phone Number"
                        data-cy="user-phone"
                        defaultCountry="ua"
                        name="phone"
                        {...getFieldProps('phone')}
                        value={values.phone}
                        onChange={handleChange('phone')}
                        error={Boolean(touched.phone && errors.phone)}
                        helperText={touched.phone && errors.phone}
                      />
                    </Stack>
                  </Stack>
                  <Stack width="50%" alignItems="center" justifyContent="center">
                    <AvatarUpload
                      user={client?.client}
                      type="client"
                      flag="edit"
                      handler={setFieldValue}
                      avatar={values.avatar_url}
                    />
                  </Stack>
                </Stack>
                <Stack mt={2} spacing={2}>
                  <TextField
                    fullWidth
                    label="Additional information"
                    name="add_info"
                    value={values.add_info}
                    onChange={handleChange}
                  />
                  <Stack direction="row" gap={2}>
                    <Button
                      type="submit"
                      sx={{ height: '30px' }}
                      disabled={!isValid}
                      variant="contained"
                    >
                      {t('Save')}
                    </Button>
                    <Button
                      onClick={() => setIsOpen(true)}
                      sx={{ height: '30px' }}
                      variant="contained"
                    >
                      {t('cancel')}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Stack>
        )}
      </PageLayout>
    </Page>
  );
};
