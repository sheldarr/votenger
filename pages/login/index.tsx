import React from 'react';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../auth';

export const URL = '/login';

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 2rem;
`;

const LoginPage: React.FunctionComponent = () => {
  const router = useRouter();

  return (
    <Container>
      <StyledPaper>
        <Grid container justify="center">
          <Grid item xs={4}>
            <Typography align="center" variant="h5">
              Login
            </Typography>
            <Formik
              initialValues={{ nickname: '' }}
              onSubmit={(values) => {
                login(values.nickname);
                router.push('/');
              }}
              validationSchema={Yup.object().shape({
                nickname: Yup.string().required('Pole jest wymagane'),
              })}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
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
                          error={errors.nickname && touched.nickname}
                          helperText={
                            errors.nickname &&
                            touched.nickname &&
                            errors.nickname
                          }
                          id="nickname"
                          label="Nick"
                          margin="normal"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.nickname}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          fullWidth
                          color="primary"
                          disabled={isSubmitting}
                          type="submit"
                          variant="contained"
                        >
                          Zaloguj
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default LoginPage;
