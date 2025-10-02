import { useState } from "react";
import { Container, Box, Typography, Stack, Link, Chip, Divider, Grid, Card, CardActionArea,
    CardMedia, CardContent, Dialog, DialogTitle, DialogContent, IconButton, Button, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import SiteTopBar from "../../components/AppBar/SiteTopBar";
import AppFooter from "../../components/Layout/AppFooter";

type Shot = { src: string; title: string };

const screenshots: Shot[] = [
    { src: "/screenshots/Dashboard.png", title: "Dashboard – KPIs & Upcoming Deadlines" },
    { src: "/screenshots/Projects.png", title: "Projects – Active / Paused / Archived" },
    { src: "/screenshots/Tasks.png", title: "Tasks – Kanban with Drag & Drop" },
    { src: "/screenshots/Calendar.png", title: "Calendar (DnD) – Overdue / Upcoming / Done" },
    { src: "/screenshots/Settings.png", title: "Settings – Profile & Password" },
];

function TechChips() {
    return (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
            <Chip label="Spring Boot" color="primary" />
            <Chip label="Java" color="secondary" />
            <Chip label="React" color="success" />
            <Chip label="TypeScript" color="info" />
            <Chip label="Material UI" color="secondary" variant="outlined" />
            <Chip label="JWT (stateless)" color="warning" />
            <Chip label="REST API" color="primary" variant="outlined" />
            <Chip label="Vite" color="info" variant="outlined" />
            <Chip label="MongoDB" color="success" />
        </Stack>
    );
}

export default function AboutPage() {
    const [open, setOpen] = useState(false);
    const [activeShot, setActiveShot] = useState<Shot | null>(null);

    const handleOpen = (shot: Shot) => {
        setActiveShot(shot);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const descriptionEN = (
        <Typography color="text.secondary">
            TaskRaum is a project & task management web app built as my <strong>Capstone Project</strong> for the
            <Link href="https://www.neuefische.de/bootcamp/java-development" target="_blank" rel="noopener" underline="hover" sx={{ ml: 0.5 }}>
                Java Development Bootcamp (neue fische GmbH)
            </Link>.
            The bootcamp lasted 3 months, and <strong>this project was developed in 1 month</strong>.
            Tech: Spring Boot backend, React + TypeScript frontend. CRUD operations with a REST API and
            stateless, token-based security using JWT.
        </Typography>
    );

    const descriptionDE = (
        <Typography color="text.secondary">
            TaskRaum ist eine Web-App für Projekt- und Aufgabenverwaltung und entstand als mein <strong>Abschlussprojekt</strong> im
            <Link href="https://www.neuefische.de/bootcamp/java-development" target="_blank" rel="noopener" underline="hover" sx={{ ml: 0.5 }}>
                Java Development Bootcamp (neue fische GmbH)
            </Link>.
            Das Bootcamp dauerte 3 Monate; <strong>die Entwicklung dieses Projekts erfolgte in 1 Monat</strong>.
            Technologie: Spring Boot im Backend, React + TypeScript im Frontend. CRUD mit REST-API sowie
            zustandslose, tokenbasierte Sicherheit per JWT.
        </Typography>
    );

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <SiteTopBar />

            {/* MAIN */}
            <Box component="main" sx={{ flex: 1 }}>
                <Container maxWidth="lg">
                    <Box sx={{ py: { xs: 8, md: 12 } }}>
                        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: 0.2 }}>
                            About TaskRaum
                        </Typography>

                        {/* English Description */}
                        <Stack spacing={1} sx={{ mb: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LanguageIcon fontSize="small" />
                                <Typography variant="overline">English</Typography>
                            </Stack>
                            {descriptionEN}
                        </Stack>

                        {/* German Description */}
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LanguageIcon fontSize="small" />
                                <Typography variant="overline">Deutsch</Typography>
                            </Stack>
                            {descriptionDE}
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Button
                                variant="contained"
                                component={Link}
                                href="https://github.com/emrullaharac/TaskRaum"
                                target="_blank"
                                rel="noopener"
                                startIcon={<GitHubIcon />}
                            >
                                GitHub Repository
                            </Button>
                        </Stack>

                        {/* Tech stack */}
                        <Typography variant="h6" fontWeight={800} gutterBottom>
                            Tech Stack
                        </Typography>
                        <TechChips />

                        <Divider sx={{ my: 4 }} />

                        {/* Highlights */}
                        <Typography variant="h6" fontWeight={800} gutterBottom>
                            Highlights
                        </Typography>
                        <Stack spacing={1} sx={{ mb: 4 }}>
                            <Typography>
                                • <strong>Dashboard:</strong> metrics — <em>Total Projects</em>, <em>Open Tasks</em>,
                                <em>Due Soon (7d)</em>, <em>Completion %</em>; lists — <em>Upcoming Deadlines (7 days)</em>, <em>Open Tasks (Top 5)</em>.
                            </Typography>
                            <Typography>
                                • <strong>Projects:</strong> <em>Active, Paused, Archived</em>.
                                Paused/Archived are hidden from Tasks & Calendar; Archived act as snapshots until restored.
                            </Typography>
                            <Typography>
                                • <strong>Tasks:</strong> Kanban with drag & drop; statuses update by column; priorities
                                <em> Low / Medium / High</em> with colored pills.
                            </Typography>
                            <Typography>
                                • <strong>Calendar:</strong> Categorizes tasks as <em>Overdue / Upcoming / Done</em>.
                                Drag & drop to reschedule; mark tasks as done inline.
                            </Typography>
                            <Typography>
                                • <strong>Settings:</strong> Update profile name and change password.
                            </Typography>
                        </Stack>

                        {/* Screenshots */}
                        <Typography variant="h6" fontWeight={800} gutterBottom>
                            Screenshots
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Click any screenshot to view it larger.
                        </Typography>

                        <Grid container spacing={2}>
                            {screenshots.map((shot) => (
                                <Grid key={shot.src} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Card sx={{ borderRadius: 2, overflow: "hidden",  border: (theme) => `1px solid ${theme.palette.divider}`, }}>
                                        <CardActionArea onClick={() => handleOpen(shot)}>
                                            <CardMedia
                                                component="img"
                                                image={shot.src}
                                                alt={shot.title}
                                                sx={{ height: 180, objectFit: "cover" }}
                                            />
                                            <CardContent sx={{ py: 1.5 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {shot.title}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Modal Viewer */}
                        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                            <DialogTitle sx={{ pr: 5 }}>
                                {activeShot?.title}
                                <IconButton
                                    aria-label="close"
                                    onClick={handleClose}
                                    sx={{ position: "absolute", right: 8, top: 8 }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent sx={{ bgcolor: "transparent" }}>
                                {activeShot && (
                                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                        <Box
                                            sx={{
                                                border: (t) => `1px solid ${t.palette.divider}`,
                                                borderRadius: 2,
                                                p: 1,
                                                bgcolor: "background.paper",
                                                boxShadow: 1,
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={activeShot.src}
                                                alt={activeShot.title}
                                                sx={{
                                                    maxWidth: "min(100%, 1200px)",
                                                    maxHeight: "80vh",
                                                    display: "block",
                                                    borderRadius: 1,
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}
                            </DialogContent>
                        </Dialog>

                        <Divider sx={{ my: 6 }} />

                        {/* Who am I */}
                        <Typography variant="h6" fontWeight={800} gutterBottom>
                            Who am I? - Emrullah Arac
                        </Typography>
                        <Stack spacing={1} sx={{ mb: 2 }}>
                            <Typography color="text.secondary">
                                I’m a software developer with experience in ERP systems and CMS platforms like WordPress and Webflow.
                                I’ve built both business and e‑commerce websites. Lately I create projects with Java, Spring Boot,
                                and React. I love software and computers, use Linux daily, and enjoy building clean, practical apps.
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    href="https://github.com/emrullaharac"
                                    target="_blank"
                                    rel="noopener"
                                    startIcon={<GitHubIcon />}
                                >
                                    My GitHub
                                </Button>
                            </Stack>
                        </Stack>

                        {/* Who am I - German version */}
                        <Stack spacing={1}>
                            <Typography variant="h6" fontWeight={700}>Wer bin ich? - Emrullah Arac</Typography>
                            <Typography color="text.secondary">
                                Ich bin Softwareentwickler mit Erfahrung in ERP‑Systemen sowie CMS wie WordPress und Webflow.
                                Ich habe Geschäfts- und E‑Commerce‑Websites umgesetzt. Aktuell entwickle ich mit Java, Spring Boot
                                und React. Ich habe eine große Leidenschaft für Software, nutze täglich Linux und baue gern
                                klare, praxisnahe Anwendungen.
                            </Typography>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* FOOTER */}
            <AppFooter />
        </Box>
    );
}
