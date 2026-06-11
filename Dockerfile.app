FROM node:24-alpine
WORKDIR /app

RUN apk add --no-cache openssl 

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate 
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
