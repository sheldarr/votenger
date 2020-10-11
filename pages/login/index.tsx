import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { URL as MAIN_PAGE_URL } from '..';
import useUser from '../../hooks/useUser';

export const URL = '/login';

const ADMINS_SEPARATOR = ';';

const LoginPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user, setUser] = useUser();

  useEffect(() => {
    if (user) {
      router.push(MAIN_PAGE_URL);
    }
  });

  return (
    <Container>
      <Grid container justify="center">
        <Grid item md={4} xs={12}>
          <Formik
            initialValues={{ username: '' }}
            onSubmit={(values) => {
              setUser({
                isAdmin: process.env.NEXT_PUBLIC_ADMINS.split(
                  ADMINS_SEPARATOR,
                ).includes(values.username),
                username: values.username,
              });

              router.push(MAIN_PAGE_URL);
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
    </Container>
  );
};

export default LoginPage;
