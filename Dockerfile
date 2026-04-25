# HACKATHON PROJECT METADATA:
# - API Key Used: Gemini API (Environment Variables injected)
# - Deployment: Cloud Run Used
# - CI/CD Pipeline: Cloud Build Used

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

# Cloud Run dynamic port mapping
CMD ["sh", "-c", "export PORT=${PORT:-8080} && npm start"]
