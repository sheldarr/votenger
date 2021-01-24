import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';

interface Props {
  onClose: () => void;
  open: boolean;
}

const CreateEventModal: React.FunctionComponent<Props> = ({
  onClose,
  open,
}) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <Formik
        initialValues={{
          name: '',
        }}
        onSubmit={async (values) => {
          await axios.post('/api/events', values);

          onClose();
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
              <DialogTitle>New event</DialogTitle>
              <DialogContent>
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
              </DialogContent>
              <DialogActions>
                <Button color="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={isSubmitting || !isValid}
                  type="submit"
                >
                  Create
                </Button>
              </DialogActions>
            </form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default CreateEventModal;
