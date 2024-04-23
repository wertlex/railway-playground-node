# how to build:
# docker build -f ./build/docker/release/Dockerfile .

# Useful references:
# node + docker: https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
# private npm modules + docker: https://docs.npmjs.com/docker-and-private-modules
# hiding keys by using building stages: https://stackoverflow.com/a/48565025/1040070

# intermediate image
FROM node:18.17.1 as intermediate

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
# note, there is .dockerignore file in the project root which prevents `node_modules` from copying here
COPY . .
RUN npm run build:release
# removing original sources - we don't need them in final image
RUN rm -rf src test config build
# unpacking dist contents to the root
RUN mv ./dist/* .
RUN rm -rf ./dist

# final image
FROM node:18.17.1
WORKDIR /usr/src/app
COPY --from=intermediate /usr/src/app /usr/src/app

EXPOSE 80
CMD ["node", "main.js"]
