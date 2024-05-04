FROM node:22-slim AS build
WORKDIR /build
COPY . .
RUN npm install
RUN npm run build

FROM nginx:stable-alpine3.19-perl
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]