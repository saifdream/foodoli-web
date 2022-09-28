import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
    palette: {
        background: {
            dark: '#F4F6F8',
            default: colors.common.white,
            paper: colors.common.white
        },
        default: {
            main: '#388f48'// colors.indigo[500]
        },
        primary: {
            main: '#ffffff'// colors.indigo[500]
        },
        secondary: {
            main: '#6ac075'// colors.indigo[500]
        },
        icon: {
            default: '#49b05c'
        },
        text: {
            black: '#000000',
            primary: '#000000',
            secondary: '#6ac075'
        }
    },
    shadows,
    typography
});

export default theme;
