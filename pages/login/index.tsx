import React from 'react';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { URL as EVENTS_PAGE_URL } from '../events';
import useUser from '../../hooks/useUser';
import Page from '../../components/Page';

export const URL = '/login';

const LoginPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [, setUser] = useUser();

  return (
    <Page title="Login">
      <Grid container justify="center">
        <Grid item md={4} xs={12}>
          <Formik
            initialValues={{ username: '' }}
            onSubmit={(values) => {
              setUser({
                username: values.username,
              });

              router.push(EVENTS_PAGE_URL);
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().required('Field is required'),
            })}
          >
            {(props) => {
              const {
                values,
                touched,
                errors,
                isSubmitting,
                isValid,
                handleChange,
                handleBlur,
                handleSubmit,
              } = props;
              return (
                <form onSubmit={handleSubmit}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item></Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        error={errors.username && touched.username}
                        helperText={
                          errors.username && touched.username && errors.username
                        }
                        id="username"
                        inputProps={{ maxLength: 16 }}
                        label="Username"
                        margin="normal"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.username}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        fullWidth
                        color="primary"
                        disabled={isSubmitting || !isValid}
                        type="submit"
                        variant="contained"
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
    </Page>
  );
};

export default LoginPage;
