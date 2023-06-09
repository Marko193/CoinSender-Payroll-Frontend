import { Stack, Typography, useTheme, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LeftIcon from '../assets/icons/arrow-button-left.svg';
import Iconify from './Iconify';

export const PageTitle = ({
  title,
  path,
  button_name,
  button_route,
  button_icon,
  handler,
  border,
}) => {
  const { spacing } = useTheme();
  return (
    <Stack
      width="100%"
      flexDirection="row"
      alignItems="center"
      position="relative"
      justifyContent="space-between"
      mt={spacing(9)}
      mb={spacing(3)}
    >
      {path && handler && (
        <Stack onClick={handler} style={{ position: 'absolute', top: '-100%', cursor: 'pointer' }}>
          <img width="20px" height="20px" src={LeftIcon} alt="" />
        </Stack>
      )}
      {path && !handler && (
        <Link to={path} style={{ position: 'absolute', top: '-100%', cursor: 'pointer' }}>
          <img width="20px" height="20px" src={LeftIcon} alt="" />
        </Link>
      )}
      <Stack borderBottom={border ? '1px solid #FFA31A' : 'none'}>
        <Typography variant="caption">{title}</Typography>
      </Stack>
      {button_name && button_route && (
        <Button
          variant="contained"
          component={Link}
          to={button_route}
          startIcon={button_icon ? <Iconify icon="eva:plus-fill" /> : null}
        >
          {button_name}
        </Button>
      )}
    </Stack>
  );
};
