FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY api/Irudd.When.Api/. ./
RUN dotnet restore

# copy everything else and build app
WORKDIR /app
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
ENTRYPOINT ["dotnet", "Irudd.When.Api.dll"]