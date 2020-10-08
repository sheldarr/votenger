import React, { useEffect } from 'react';
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
import axios from 'axios';

import { URL as MAIN_PAGE_URL } from '../..';
import useUser from '../../../hooks/useUser';

export const URL = '/polls/create';

const StyledPaper = styled(Paper)`
  margin-bottom: 2rem;
  margin-top: 2rem;
  padding: 2rem;
`;

const CreatePollPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push(MAIN_PAGE_URL);
    }
  });

  return (
    <Container>
      <StyledPaper>
        <Grid container justify="center">
          <Grid item xs={4}>
            <Typography align="center" variant="h2">
              Poll
            </Typography>
            <Formik
              initialValues={{ description: '', name: '' }}
              onSubmit={async (values) => {
                await axios.post('/api/polls', values);

                router.push(MAIN_PAGE_URL);
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required('Field is required'),
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
                          error={errors.name && touched.name}
                          helperText={
                            errors.name && touched.name && errors.name
                          }
                          id="name"
                          label="Name"
                          margin="normal"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          fullWidth
                          id="description"
                          label="Description"
                          margin="normal"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.description}
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
                          Create
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

export default CreatePollPage;
