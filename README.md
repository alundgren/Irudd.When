# Irudd.When

Meeting scheduler app. Main focus is learning react.

- Ui testing with test-ids seems brittle and bad. Are there better ways of doing this?

## Deploy api

>> npm install -g caprover
>> caprover deploy

## Api nginx config

<pre>
  add_header Access-Control-Allow-Origin "https://when.irudd.se";
  add_header 'Access-Control-Allow-Credentials' 'true';<%
if (s.forceSsl) {
%>
    server {

        listen       80;

        server_name  <%-s.publicDomain%>;

        # Used by Lets Encrypt
        location /.well-known/acme-challenge/ {
            root <%-s.staticWebRoot%>;
        }

        # Used by CapRover for health check
        location /.well-known/captain-identifier {
            root <%-s.staticWebRoot%>;
        }

        location / {
            return 302 https://$http_host$request_uri;
        }
    }
<%
}
%>


server {

    <%
    if (!s.forceSsl) {
    %>
        listen       80;
    <%
    }
    if (s.hasSsl) {
    %>
        listen              443 ssl http2;
        ssl_certificate     <%-s.crtPath%>;
        ssl_certificate_key <%-s.keyPath%>;
    <%
    }
    %>

        client_max_body_size 500m;

        server_name  <%-s.publicDomain%>;

        # 127.0.0.11 is DNS set up by Docker, see:
        # https://docs.docker.com/engine/userguide/networking/configure-dns/
        # https://github.com/moby/moby/issues/20026
        resolver 127.0.0.11 valid=10s;
        # IMPORTANT!! If you are here from an old thread to set a custom port, you do not need to modify this port manually here!!
        # Simply change the Container HTTP Port from the dashboard HTTP panel
        set $upstream http://<%-s.localDomain%>:<%-s.containerHttpPort%>;

        location / {

  if ($request_method = OPTIONS) {
    add_header Access-Control-Allow-Origin "https://when.irudd.se";
    add_header Access-Control-Allow-Methods "*";
    add_header Access-Control-Allow-Headers "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-signalr-user-agent";
    add_header Access-Control-Allow-Credentials "true";
    add_header Content-Length 0;
    add_header Content-Type text/plain;
    return 204;
  }

  add_header Access-Control-Allow-Origin "https://when.irudd.se";
  add_header 'Access-Control-Allow-Credentials' 'true';
    
    <%
    if (s.httpBasicAuthPath) {
    %>
            auth_basic           "Restricted Access";
            auth_basic_user_file <%-s.httpBasicAuthPath%>; 
    <%
    }
    %>

            proxy_pass $upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

    <%
    if (s.websocketSupport) {
    %>
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Access-Control-Allow-Origin "https://when.irudd.se";
            proxy_set_header 'Access-Control-Allow-Credentials' 'true';
            proxy_http_version 1.1;
    <%
    }
    %>
        }

        # Used by Lets Encrypt
        location /.well-known/acme-challenge/ {
            root <%-s.staticWebRoot%>;
        }
        
        # Used by CapRover for health check
        location /.well-known/captain-identifier {
            root <%-s.staticWebRoot%>;
        }

        error_page 502 /captain_502_custom_error_page.html;
        location = /captain_502_custom_error_page.html {
                root <%-s.customErrorPagesDirectory%>;
                internal;
        }
}

</pre>

These two parts are added from the default to make cors actually work through the proxy:

<pre>
  if ($request_method = OPTIONS) {
    add_header Access-Control-Allow-Origin "https://when.irudd.se";
    add_header Access-Control-Allow-Methods "*";
    add_header Access-Control-Allow-Headers "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-signalr-user-agent";
    add_header Access-Control-Allow-Credentials "true";
    add_header Content-Length 0;
    add_header Content-Type text/plain;
    return 204;
  }

  add_header Access-Control-Allow-Origin "https://when.irudd.se";
  add_header 'Access-Control-Allow-Credentials' 'true';
</pre>

<pre>
            proxy_set_header Access-Control-Allow-Origin "https://when.irudd.se";
            proxy_set_header 'Access-Control-Allow-Credentials' 'true';
</pre>