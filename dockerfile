FROM node:10 AS build

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build



FROM nginx:stable
COPY --from=build /app/build/ /usr/share/nginx/html