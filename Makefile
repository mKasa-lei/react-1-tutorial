
all:
	docker-compose up -d

app:
	docker-compose up -d react

app-typescript:
	docker-compose up -d react-typescript

down:
	docker-compose down

clean: 
	docker system prune -f --volumes

build:
	docker-compose build
