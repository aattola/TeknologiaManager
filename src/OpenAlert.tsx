import * as React from 'react';
import ButtonA from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';

const Button = styled(ButtonA)`
  background: #313131;
  color: white;
  box-sizing: border-box;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  outline: none;
  color: white !important;
  /*
  :focus {
    border: 1px solid #464646;
  }

  :active {
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
  }

  :hover {
    border: 1px solid #464646;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  } */
`;

const ButtonOutlined = styled(Button)`
  border: 1px solid #464646;
  color: white !important;
  margin-bottom: 5px;
`;

export default function AlertDialog({ open, setOpen, next }) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ButtonOutlined type="button" onClick={handleClickOpen}>
        Käynnistä selain
      </ButtonOutlined>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">HERÄTYS</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Kun avaat selaimen tämän kautta pidä huoli siitä että chrome on jo
            nyt kiinni ja kaikki on tallennettu sillä kun painat jatka nappulaa
            niin chrome tuhotaan maan tasalle ( sammutetaan )
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonA onClick={handleClose}>Ei jatketa</ButtonA>
          <ButtonA
            onClick={() => {
              handleClose();
              next();
            }}
            autoFocus
          >
            Jatka
          </ButtonA>
        </DialogActions>
      </Dialog>
    </div>
  );
}
