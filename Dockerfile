FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 8080

# Cloud Run sets the PORT environment variable. We dynamically replace Nginx's default port with $PORT before starting it.
CMD sed -i -e 's/listen  *80;/listen '"$PORT"';/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
