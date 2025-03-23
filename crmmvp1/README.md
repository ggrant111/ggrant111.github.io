# CRM MVP

A web-based MVP tool for car dealerships that integrates with CDK CRM using the Fortellis.io API and OpenAI to generate AI-powered sales suggestions.

## Features

- **Login system** with basic authentication
- **Sales dashboard** with lead list, funnel stage tracking, and last contact information
- **Lead detail page** with customer information and interaction history
- **AI-powered sales suggestions** including:
  - Next step in the sales funnel
  - Email templates (subject + message)
  - Text message templates
  - Phone call scripts

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **AI Integration**: OpenAI API
- **CRM Integration**: Fortellis.io API (mock data for MVP)

## Project Structure

```
project/
├── api/
│   ├── models/
│   │   ├── ai.js
│   │   └── customers.js
│   ├── routes/
│   │   ├── ai.js
│   │   └── customers.js
│   ├── services/
│   │   ├── customers.js
│   │   └── openai.js
│   └── utils/
├── public/
│   ├── css/
│   │   ├── main.css
│   │   ├── login.css
│   │   ├── dashboard.css
│   │   └── lead-detail.css
│   └── js/
│       ├── login.js
│       ├── dashboard.js
│       └── lead-detail.js
├── views/
│   ├── login.html
│   ├── dashboard.html
│   └── lead-detail.html
├── server.js
├── package.json
├── .env
└── README.md
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the application:
   ```
   npm run dev
   ```

## MVP Login Credentials

- **Username**: demo
- **Password**: password

## Future Enhancements

- Integration with real Fortellis.io API for actual CRM data
- User management and role-based access control
- Enhanced AI suggestions with more specific sales approaches
- Analytics dashboard for tracking sales performance
- Mobile responsiveness for field sales representatives
