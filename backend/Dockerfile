FROM golang:1.24-alpine AS builder
ENV GOTOOLCHAIN=auto
RUN apk add --no-cache gcc musl-dev
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 go build -o /app/api ./cmd/api

FROM alpine:3.20
RUN apk add --no-cache ca-certificates wget
COPY --from=builder /app/api /app/api
RUN mkdir -p /app/tmp
EXPOSE 8080
CMD ["/app/api"]
