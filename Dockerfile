FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --silent && \
    npm install -g typescript ts-node && \
    npm install -g tslint && \
    apk add --no-cache make gcc g++ python3 && \
    npm run build && \
    apk del make gcc g++ python3
COPY . .
EXPOSE 3000
CMD ["npm", "run", "build"]