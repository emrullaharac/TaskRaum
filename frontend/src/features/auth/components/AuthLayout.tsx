import {Container, Box, Typography, Link, Stack} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Logo from "../../../assets/icon_2.svg";

type Props = {
    title: string;
    subtitle?: string;
    children: React.ReactNode
};

export default function AuthLayout({ title, subtitle, children }: Props) {
    return (
        <Container maxWidth="xs">
            <Box py={8} display="flex" flexDirection="column" alignItems="center">
                <Link component={RouterLink} to="/" underline="none" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <img src={Logo} alt="TaskRaum logo" width={40} height={40} />
                        <Typography variant="h5" fontWeight={800}>TaskRaum</Typography>
                    </Stack>
                </Link>

                <Typography variant="h4" fontWeight={700} mb={1} textAlign="center">
                    {title}
                </Typography>
                {subtitle && (
                    <Typography color="text.secondary" mb={3} textAlign="center">
                        {subtitle}
                    </Typography>
                )}

                <Box width="100%">{children}</Box>
            </Box>
        </Container>
    );
}