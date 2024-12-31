import { Box, Container, Typography } from '@mui/material';

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Privacy Policy
      </Typography>
      
      <Typography variant="body1" paragraph>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        1. Introduction
      </Typography>
      <Typography variant="body1" paragraph>
        This Privacy Policy describes how AIMade.fun ("we," "us," or "our") collects, uses, and shares your information when you use our AI project generation service.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        2. Information We Collect
      </Typography>
      <Typography variant="body1" gutterBottom>
        When you use our service, we collect:
      </Typography>
      <Box component="ul" sx={{ pl: 4, mb: 2 }}>
        <li>Project descriptions and requirements you provide</li>
        <li>Generated code and project files</li>
        <li>GitHub repository information (if you choose to use our GitHub integration)</li>
        <li>API keys and authentication tokens you provide</li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        3. How We Use Your Information
      </Typography>
      <Typography variant="body1" gutterBottom>
        We use your information to:
      </Typography>
      <Box component="ul" sx={{ pl: 4, mb: 2 }}>
        <li>Generate project code and documentation</li>
        <li>Create and manage GitHub repositories</li>
        <li>Improve our AI models and service quality</li>
        <li>Ensure security and prevent abuse</li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        4. Information Sharing
      </Typography>
      <Typography variant="body1" gutterBottom>
        We share your information with:
      </Typography>
      <Box component="ul" sx={{ pl: 4, mb: 2 }}>
        <li>OpenAI (for code generation)</li>
        <li>GitHub (for repository creation and management)</li>
        <li>Service providers who assist in operating our service</li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        5. Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        6. Your Rights
      </Typography>
      <Typography variant="body1" gutterBottom>
        You have the right to:
      </Typography>
      <Box component="ul" sx={{ pl: 4, mb: 2 }}>
        <li>Access your personal information</li>
        <li>Request deletion of your information</li>
        <li>Opt-out of certain data processing activities</li>
        <li>Revoke API access and delete repositories</li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        7. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        8. Contact Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        If you have any questions about this Privacy Policy, please contact us at:
      </Typography>
      <Box component="ul" sx={{ pl: 4, mb: 2 }}>
        <li>Email: GPTdevAi@proton.me</li>
        <li>Website: https://aimade.fun</li>
      </Box>
    </Container>
  );
} 