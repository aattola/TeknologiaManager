import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import styled, { css } from 'styled-components';
import TextField from '@material-ui/core/TextField';
import ButtonA from '@material-ui/core/Button';

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

const Card = styled.div`
  background: #313131;
  border: 1px solid #464646;
  border-radius: 6px;
  /* padding: 10px 20px; */
`;

const VersionCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0px;
  padding: 5px 10px;

  ${(props) =>
    props.downloaded &&
    css`
      background: white;
      color: black;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    `}
`;

const Accordion = withStyles({
  root: {
    border: '1px solid #464646',
    boxShadow: 'none',
    color: 'white',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: '#313131',
    borderBottom: '1px solid #464646',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: '#313131',
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions({
  data: seData,
  loadedIndex,
  loadIndex,
}) {
  const data = Object.entries(seData);
  console.log(data);
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      {data.map((entry, i2) => (
        <Accordion
          key={i2}
          square
          expanded={expanded === i2}
          onChange={handleChange(i2)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>{entry[0]}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {entry[1].map((en, i) => (
              <VersionCard downloaded={en.id === loadedIndex.id} key={en.id}>
                <h3 style={{ margin: 0 }}>{en.tag_name}</h3>
                <Button
                  disabled={loadedIndex.id === en.id}
                  onClick={() => loadIndex(en)}
                >
                  Lataa
                </Button>
              </VersionCard>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
