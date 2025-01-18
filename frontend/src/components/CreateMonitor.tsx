import { Box, Button, MenuItem, Paper, Select, TextField } from '@mui/material';
function CreateMonitor() {
    return <Box display="flex" alignContent="center" justifyContent="center" marginTop="5em">
        <Paper elevation={3} sx={{ padding: '1em' 
                ,width: {
                    xs: '90%',
                    sm: '80%',
                    md: '50%',
                    lg: '40%',
                    xl: '30%'
                }
        }}>
            <h1>
                Create a new monitor
            </h1>
            <form>
                <Box display="flex" alignContent="center" justifyContent="center" flexDirection="column" gap={3}>
                    <TextField label="Monitor name" variant="standard" />
                    <Select variant='standard' label="Type" value="HTTP">
                        <MenuItem value={"HTTP"}>HTTP</MenuItem>
                        <MenuItem value={"TCP"}>TCP</MenuItem>
                    </Select>
                    <TextField label="URL" variant="standard" />
                    <TextField label="Port" variant="standard" />
                    <TextField label="Method" variant="standard" />
                    <Button variant="contained">Save</Button>
                </Box>
            </form>
        </Paper>
    </Box>
}

export default CreateMonitor;