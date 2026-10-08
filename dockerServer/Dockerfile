FROM tomcat:11-jdk21
 
ENV DB_RESOURCE_NAME="jdbc/helloworld" DB_URL="" DB_USERNAME="" DB_DRIVER_CLASS_NAME=""
ENV DB_PASSWORD_FILE="secrets/db-password" 
ENV MANAGER_PASSWORD_FILE="secrets/manager-password"

COPY conf/context.xml conf/tomcat-users.xml ./conf/
COPY webapps/manager/META-INF/context.xml ./webapps/manager/META-INF/context.xml
ADD https://repo1.maven.org/maven2/org/postgresql/postgresql/42.7.4/postgresql-42.7.4.jar ./lib/

COPY --from=webapp /api.war ./webapps/api.war

COPY run-catalina.sh /run-catalina.sh
RUN chmod +x /run-catalina.sh

CMD ["/run-catalina.sh"]
