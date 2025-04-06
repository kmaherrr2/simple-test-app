FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install express cors pg ws bcrypt jsonwebtoken
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]