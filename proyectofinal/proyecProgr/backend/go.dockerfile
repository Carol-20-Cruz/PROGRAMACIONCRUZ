FROM golang:1.24.3

WORKDIR /app

COPY . .

##Descargar
RUN go get -d -v ./...

##Construir
RUN go build -o api .

EXPOSE 8000

CMD ["./api"]




