# 第一階段：編譯（Build Stage）
# 用完整的 Maven + JDK 環境把程式碼編譯成 jar 檔
FROM maven:3.9-eclipse-temurin-17 AS build

# 設定工作目錄
WORKDIR /app

# 先複製 pom.xml，讓 Docker 快取套件下載
# 這樣只有 pom.xml 改變時才重新下載套件，程式碼改變不會重新下載
COPY pom.xml .
RUN mvn dependency:go-offline

# 複製所有原始碼並編譯
COPY src ./src
RUN mvn clean package -DskipTests

# 第二階段：執行（Runtime Stage）
# 只用輕量的 JRE 環境跑編譯好的 jar 檔，不需要整個 Maven
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 從第一階段複製編譯好的 jar 檔
COPY --from=build /app/target/*.jar app.jar

# 告訴 Docker 這個容器對外開放 8080 port
EXPOSE 8080

# 容器啟動時執行這個指令
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-jar", "app.jar"]