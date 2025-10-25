import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components"

interface BookingConfirmationEmailProps {
  userName: string
  activityTitle: string
  activityLocation: string
  date: string
  participants: number
  totalPrice: number
  bookingId: string
}

export function BookingConfirmationEmail({
  userName = "Guest",
  activityTitle = "Nature Adventure",
  activityLocation = "Portland, OR",
  date = "October 25, 2025",
  participants = 2,
  totalPrice = 50,
  bookingId = "BOOK123",
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your booking is confirmed for {activityTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🌲 movinature</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h2}>Booking Confirmed!</Heading>

            <Text style={text}>Hi {userName},</Text>

            <Text style={text}>
              Great news! Your booking has been confirmed. We&apos;re excited to see you on your adventure!
            </Text>

            {/* Booking Details Card */}
            <Section style={card}>
              <Heading style={h3}>{activityTitle}</Heading>

              <Hr style={divider} />

              <Text style={detailLabel}>📍 Location</Text>
              <Text style={detailValue}>{activityLocation}</Text>

              <Text style={detailLabel}>📅 Date</Text>
              <Text style={detailValue}>{date}</Text>

              <Text style={detailLabel}>👥 Participants</Text>
              <Text style={detailValue}>{participants} {participants === 1 ? 'person' : 'people'}</Text>

              <Hr style={divider} />

              <Text style={totalLabel}>Total Paid</Text>
              <Text style={totalValue}>${totalPrice}</Text>
            </Section>

            {/* Booking ID */}
            <Text style={bookingIdText}>
              Booking ID: <strong>{bookingId}</strong>
            </Text>

            {/* What's Next */}
            <Section style={infoSection}>
              <Heading style={h4}>What&apos;s Next?</Heading>
              <Text style={text}>
                • You&apos;ll receive a reminder email 24 hours before your activity
              </Text>
              <Text style={text}>
                • Check your email for any updates or changes
              </Text>
              <Text style={text}>
                • Arrive 15 minutes early for check-in
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link
                style={button}
                href={`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/bookings`}
              >
                View My Bookings
              </Link>
            </Section>

            {/* Footer */}
            <Hr style={divider} />

            <Text style={footer}>
              Questions? Contact us at support@movinature.com
            </Text>

            <Text style={footer}>
              © {new Date().getFullYear()} Movinature. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default BookingConfirmationEmail

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
}

const header = {
  padding: "24px",
  textAlign: "center" as const,
  backgroundColor: "#10b981",
}

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
}

const content = {
  padding: "0 48px",
}

const h2 = {
  color: "#1f2937",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 0 20px",
}

const h3 = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px",
}

const h4 = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "24px 0 12px",
}

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const card = {
  backgroundColor: "#f9fafb",
  border: "2px solid #e5e7eb",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
}

const detailLabel = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
  margin: "12px 0 4px",
  textTransform: "uppercase" as const,
}

const detailValue = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 12px",
}

const divider = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
}

const totalLabel = {
  color: "#6b7280",
  fontSize: "16px",
  fontWeight: "600",
  margin: "12px 0 4px",
}

const totalValue = {
  color: "#10b981",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
}

const bookingIdText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "16px 0",
  textAlign: "center" as const,
}

const infoSection = {
  margin: "24px 0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 40px",
}

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "center" as const,
  margin: "8px 0",
}
