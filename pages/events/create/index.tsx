import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { URL as EVENTS_URL } from '..';
import useUser from '../../../hooks/useUser';
import { isUserAdmin } from '../../../auth';
import Page from '../../../components/Page';

export const URL = '/events/create';

const CreateEventPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [user] = useUser();

  useEffect(() => {
    if (!isUserAdmin(user?.username)) {
      router.push(EVENTS_URL);
    }
  }, []);

  return (
    <Page title="Create event">
      <Grid container justify="center">
        <Grid item md={4} xs={12}>
          <Typography align="center" variant="h4">
            Create event
          </Typography>
          <Formik
            initialValues={{
              name: '',
            }}
            onSubmit={async (values) => {
              await axios.post('/api/events', values);

              router.push(EVENTS_URL);
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
                        error={errors.name && touched.name}
                        helperText={errors.name && touched.name && errors.name}
                        id="name"
                        inputProps={{ maxLength: 32 }}
                        label="Name"
                        margin="normal"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
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
    </Page>
  );
};

export default CreateEventPage;
