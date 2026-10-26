# Only the JRE is needed, not the full JDK
FROM tomcat:11-jre21

# avoid using root user
RUN groupadd --system tomcat && useradd --system --gid tomcat --no-create-home tomcat

# setup the database driver jar from the setup file
ARG DB_DRIVER_JAR_URL
RUN test -n "$DB_DRIVER_JAR_URL" || { echo "No database yet configured : run 'docker compose run --rm setup'"; exit 1; }
ADD --chmod=644 ${DB_DRIVER_JAR_URL} ./lib/

ENV DB_RESOURCE_NAME="jdbc/helloworld" DB_URL="" DB_USERNAME="" DB_DRIVER_CLASS_NAME=""
ENV DB_PASSWORD_FILE="secrets/db-password" 
ENV MANAGER_PASSWORD_FILE="secrets/manager-password"

# copy the configuration files to the image
COPY conf/context.xml conf/tomcat-users.xml ./conf/


COPY --chmod=755 run-catalina.sh /run-catalina.sh
RUN sed -i 's/\r$//' /run-catalina.sh \
 && cp conf/catalina.properties conf/catalina.properties.orig \
 && rm -rf webapps.dist \
 && chown -R tomcat:tomcat conf logs temp work webapps

# At the end to use the layered cache
COPY --from=webapp --chown=tomcat:tomcat /api.war ./webapps/api.war

USER tomcat
CMD ["/run-catalina.sh"]
