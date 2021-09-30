.PHONY: up

.PHONY: logs

.PHONY: down

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f